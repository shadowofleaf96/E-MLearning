import axios from 'axios';
import { generate } from 'otplib';
import prisma from '../shared/database/prisma';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log(
    '🧪 Starting Authentication & Authorization Integration Tests...\n'
  );

  const createdUserIds: string[] = [];
  let successCount = 0;
  let failCount = 0;

  async function testStep(name: string, fn: () => Promise<void>) {
    try {
      console.log(`🚀 Running: ${name}...`);
      await fn();
      console.log(`   ✅ PASS: ${name}\n`);
      successCount++;
    } catch (err: any) {
      console.error(`   ❌ FAIL: ${name}`);
      if (err.response) {
        console.error(`      Status: ${err.response.status}`);
        console.error(
          `      Body:`,
          JSON.stringify(err.response.data, null, 2)
        );
      } else {
        console.error(`      Error Message: ${err.message}`);
      }
      console.error('');
      failCount++;
    }
  }

  try {
    // 0. Ensure we have a tenant
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: 'Test Tenant',
          slug: 'test-tenant',
          domain: 'test-tenant.local',
        },
      });
      console.log(`Initialized temporary tenant: ${tenant.slug}`);
    }
    const tenantId = tenant.id;

    // Test data
    const randomSuffix = Math.floor(Math.random() * 10000);
    const studentEmail = `student-${randomSuffix}@test.local`;
    const password = 'TestPassword123!';
    const firstName = 'John';
    const lastName = 'TestStudent';

    let registeredUserId = '';
    let emailToken = '';
    let loginToken = '';
    let loginRefreshToken = '';
    let tempToken = '';
    let totpSecret = '';

    // =========================================================================
    // 1. REGISTRATION FLOW
    // =========================================================================

    await testStep('1.1 User Registration (Public)', async () => {
      const res = await axios.post(`${BASE_URL}/auth/register`, {
        email: studentEmail,
        password,
        firstName,
        lastName,
        tenantId,
        recaptchaToken: 'mock-token',
      });

      if (res.status !== 201) {
        throw new Error(`Expected status 201, got ${res.status}`);
      }

      // Query database to find the user and check initial state
      const dbUser = await prisma.user.findFirst({
        where: { email: studentEmail, tenantId },
      });

      if (!dbUser) {
        throw new Error('User not found in the database after registration');
      }

      registeredUserId = dbUser.id;
      createdUserIds.push(registeredUserId);
      emailToken = dbUser.emailToken || '';

      if (dbUser.isVerified !== false) {
        throw new Error('Expected new user to be unverified');
      }
      if (!emailToken) {
        throw new Error('Expected emailToken to be generated');
      }
    });

    await testStep('1.2 Email Verification', async () => {
      // Simulate verification call
      await axios.get(`${BASE_URL}/auth/verify-email/${emailToken}`, {
        maxRedirects: 0,
        validateStatus: (status) => status === 302 || status === 200,
      } as any);

      // Query database to check if user is verified
      const dbUser = await prisma.user.findUnique({
        where: { id: registeredUserId },
      });

      if (!dbUser || !dbUser.isVerified) {
        throw new Error('Expected user to be verified after verification');
      }
      if (dbUser.emailToken !== null) {
        throw new Error('Expected emailToken to be cleared after verification');
      }
    });

    // =========================================================================
    // 2. LOGIN FLOW (Without 2FA)
    // =========================================================================

    await testStep('2.1 Login with Valid Credentials', async () => {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        identifier: studentEmail,
        password,
        tenantId,
        recaptchaToken: 'mock-token',
      });

      if (res.status !== 200) {
        throw new Error(`Expected 200, got ${res.status}`);
      }

      const resData = res.data as any;
      const token = resData.token;
      const refreshToken = resData.refreshToken;
      const data = resData.data;

      if (!token) throw new Error('JWT token missing in login response');
      if (!refreshToken)
        throw new Error('Refresh token missing in login response');
      if (data.email !== studentEmail)
        throw new Error('Incorrect user in response');

      loginToken = token;
      loginRefreshToken = refreshToken;
    });

    await testStep('2.2 Login with Invalid Password (Fail)', async () => {
      try {
        await axios.post(`${BASE_URL}/auth/login`, {
          identifier: studentEmail,
          password: 'WrongPassword!',
          tenantId,
          recaptchaToken: 'mock-token',
        });
        throw new Error('Expected login to fail with 401');
      } catch (err: any) {
        if (!err.response || err.response.status !== 401) {
          throw err;
        }
      }
    });

    await testStep('2.3 Login with Non-existent Email (Fail)', async () => {
      try {
        await axios.post(`${BASE_URL}/auth/login`, {
          identifier: `nonexistent-${randomSuffix}@test.local`,
          password,
          tenantId,
          recaptchaToken: 'mock-token',
        });
        throw new Error('Expected login to fail with 401');
      } catch (err: any) {
        if (!err.response || err.response.status !== 401) {
          throw err;
        }
      }
    });

    // =========================================================================
    // 3. 2FA SETUP & ENABLING (Authenticated)
    // =========================================================================

    await testStep('3.1 Enable 2FA (Initiate Setup)', async () => {
      const res = await axios.post(
        `${BASE_URL}/auth/2fa/enable`,
        {},
        {
          headers: { Authorization: `Bearer ${loginToken}` },
        }
      );

      if (res.status !== 200) {
        throw new Error(`Expected 200, got ${res.status}`);
      }

      const resData = res.data as any;
      const qrData = resData.data || resData;
      totpSecret = qrData.secret;

      if (!totpSecret)
        throw new Error('Secret not returned in 2FA enable response');
      if (!qrData.qrCodeUrl) throw new Error('QR Code URL missing');
    });

    await testStep(
      '3.2 Verify 2FA Setup with Invalid Code (Fail)',
      async () => {
        try {
          await axios.post(
            `${BASE_URL}/auth/2fa/verify`,
            { code: '999999' },
            {
              headers: { Authorization: `Bearer ${loginToken}` },
            }
          );
          throw new Error('Expected code verification to fail');
        } catch (err: any) {
          if (!err.response || err.response.status !== 400) {
            throw err;
          }
        }
      }
    );

    await testStep(
      '3.3 Verify 2FA Setup with Valid Code (Success)',
      async () => {
        // Generate TOTP code using otplib
        const totpCode = await generate({ secret: totpSecret });

        const res = await axios.post(
          `${BASE_URL}/auth/2fa/verify`,
          { code: totpCode },
          {
            headers: { Authorization: `Bearer ${loginToken}` },
          }
        );

        if (res.status !== 200) {
          throw new Error(`Expected 200, got ${res.status}`);
        }

        // Query database to check isTwoFactorEnabled
        const dbUser = await prisma.user.findUnique({
          where: { id: registeredUserId },
        });

        if (!dbUser || !dbUser.isTwoFactorEnabled) {
          throw new Error('Expected 2FA to be enabled in database');
        }
      }
    );

    // =========================================================================
    // 4. 2FA LOGIN FLOW
    // =========================================================================

    await testStep(
      '4.1 Login Step 1 (Credentials match, requires 2FA)',
      async () => {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
          identifier: studentEmail,
          password,
          tenantId,
          recaptchaToken: 'mock-token',
        });

        if (res.status !== 200) {
          throw new Error(`Expected 200, got ${res.status}`);
        }

        const resData = res.data as any;
        if (!resData.requires2FA) {
          throw new Error('Expected requires2FA flag in response');
        }

        tempToken = resData.tempToken;
        if (!tempToken) {
          throw new Error('Expected temporary 2FA token');
        }
      }
    );

    await testStep(
      '4.2 Login Step 2 with Invalid TOTP Code (Fail)',
      async () => {
        try {
          await axios.post(`${BASE_URL}/auth/verify-2fa-login`, {
            tempToken,
            code: '111111',
            tenantId,
          });
          throw new Error('Expected 2FA verification to fail');
        } catch (err: any) {
          if (!err.response || err.response.status !== 400) {
            throw err;
          }
        }
      }
    );

    await testStep(
      '4.3 Login Step 2 with Valid TOTP Code (Success)',
      async () => {
        const totpCode = await generate({ secret: totpSecret });

        const res = await axios.post(`${BASE_URL}/auth/verify-2fa-login`, {
          tempToken,
          code: totpCode,
          tenantId,
        });

        if (res.status !== 200) {
          throw new Error(`Expected 200, got ${res.status}`);
        }

        const resData = res.data as any;
        const token = resData.token;
        const data = resData.data;
        if (!token)
          throw new Error('JWT token missing in 2FA verification response');
        if (data.email !== studentEmail)
          throw new Error('Incorrect user details returned');

        // Update our loginToken with the new authenticated token
        loginToken = token;
      }
    );

    // =========================================================================
    // 5. AUTHORIZATION & ROLE ACCESS CONTROLS
    // =========================================================================

    await testStep(
      '5.1 Access User Profile (Authenticated Student - Success)',
      async () => {
        const res = await axios.get(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${loginToken}` },
        });

        if (res.status !== 200) {
          throw new Error(`Expected 200, got ${res.status}`);
        }

        const resData = res.data as any;
        const userData = resData.data || resData.user;
        if (userData.id !== registeredUserId) {
          throw new Error('Profile does not match active test user');
        }
      }
    );

    await testStep(
      '5.2 Access Admin Endpoint as Student (Fail - Forbidden)',
      async () => {
        try {
          await axios.get(`${BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${loginToken}` },
          });
          throw new Error(
            'Expected student to be forbidden from listing all users'
          );
        } catch (err: any) {
          if (!err.response || err.response.status !== 403) {
            throw err;
          }
        }
      }
    );

    await testStep(
      '5.3 Access Admin Endpoint as Super Admin (Success)',
      async () => {
        // Login as the seeded super admin user
        const adminLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
          identifier: 'admin@etactiques.local',
          password: 'password123',
          tenantId,
          recaptchaToken: 'mock-token',
        });

        const adminToken = (adminLoginRes.data as any).token;

        const res = await axios.get(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        if (res.status !== 200) {
          throw new Error(`Expected 200, got ${res.status}`);
        }

        const resData = res.data as any;
        if (!Array.isArray(resData.users || resData.data || resData)) {
          throw new Error('Expected response to contain a list of users');
        }
      }
    );

    // =========================================================================
    // 6. DISABLING 2FA
    // =========================================================================

    await testStep('6.1 Disable 2FA with Valid Code', async () => {
      const totpCode = await generate({ secret: totpSecret });

      const res = await axios.post(
        `${BASE_URL}/auth/2fa/disable`,
        { code: totpCode },
        {
          headers: { Authorization: `Bearer ${loginToken}` },
        }
      );

      if (res.status !== 200) {
        throw new Error(`Expected 200, got ${res.status}`);
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: registeredUserId },
      });

      if (!dbUser || dbUser.isTwoFactorEnabled) {
        throw new Error('Expected 2FA to be disabled in database');
      }
      if (dbUser.twoFactorSecret !== null) {
        throw new Error('Expected 2FA secret to be cleared in database');
      }
    });

    // =========================================================================
    // 7. REFRESH TOKEN FLOW
    // =========================================================================

    await testStep('7.1 Refresh Token Rotation', async () => {
      const oldRefreshToken = loginRefreshToken;
      const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
        refreshToken: oldRefreshToken,
      });

      if (res.status !== 200) {
        throw new Error(`Expected status 200, got ${res.status}`);
      }

      const resData = res.data as any;
      if (!resData.token || !resData.refreshToken) {
        throw new Error('Expected new access and refresh tokens in response');
      }

      // Verify that the new access token is valid by using it
      const profileRes = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${resData.token}` },
      });

      if (profileRes.status !== 200) {
        throw new Error(
          `Failed to use new access token, status: ${profileRes.status}`
        );
      }

      // Store the new refresh token
      loginRefreshToken = resData.refreshToken;

      // 7.2 Revocation test with the old rotated token
      try {
        await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken: oldRefreshToken,
        });
        throw new Error('Expected rotated refresh token to fail with 401');
      } catch (err: any) {
        if (!err.response || err.response.status !== 401) {
          throw err;
        }
      }
    });

    // =========================================================================
    // 8. WORKSPACE LOOKUP (USER-TENANT LINKING)
    // =========================================================================

    await testStep('8.1 Find Institutes by Registered Email', async () => {
      const res = await axios.post(`${BASE_URL}/auth/find-institutes`, {
        email: studentEmail,
      });

      if (res.status !== 200) {
        throw new Error(`Expected status 200, got ${res.status}`);
      }

      const resData = res.data as any;
      if (!Array.isArray(resData.institutes)) {
        throw new Error('Expected response to contain an array of institutes');
      }

      const hasRegisteredTenant = resData.institutes.some(
        (inst: any) => inst.id === tenantId
      );

      if (!hasRegisteredTenant) {
        throw new Error(
          'Expected registered tenant to be listed in user institutes'
        );
      }
    });

    await testStep('8.2 Find Institutes for Non-existent Email', async () => {
      const res = await axios.post(`${BASE_URL}/auth/find-institutes`, {
        email: `doesnotexist-${randomSuffix}@test.local`,
      });

      if (res.status !== 200) {
        throw new Error(`Expected status 200, got ${res.status}`);
      }

      const resData = res.data as any;
      if (
        !Array.isArray(resData.institutes) ||
        resData.institutes.length !== 0
      ) {
        throw new Error(
          'Expected empty array of institutes for unregistered email'
        );
      }
    });
  } finally {
    // Clean up created users from DB
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
      console.log(
        `🧹 Cleaned up ${createdUserIds.length} test users from the database.`
      );
    }

    await prisma.$disconnect();

    console.log('\n======================================');
    console.log(`🏁 Test run completed:`);
    console.log(`   ✅ Successes: ${successCount}`);
    console.log(`   ❌ Failures: ${failCount}`);
    console.log('======================================\n');

    if (failCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }
}

runTests();

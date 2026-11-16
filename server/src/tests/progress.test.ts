import axios from 'axios';
import prisma from '../shared/database/prisma';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Progress System Integration Tests...\n');

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

    // Test data setup
    const randomSuffix = Math.floor(Math.random() * 10000);
    const password = 'TestPassword123!';

    const emailInstructor = `instructor-${randomSuffix}@test.local`;
    const emailStudent = `student-${randomSuffix}@test.local`;

    let tokenInstructor = '';
    let tokenStudent = '';

    let userIdInstructor = '';
    let userIdStudent = '';

    let courseId = '';
    let module1Id = '';
    let module2Id = '';

    // Helper function to register and log in a user with a specific role
    async function setupUser(email: string, role: 'student' | 'instructor') {
      // 1. Register
      await axios.post(`${BASE_URL}/auth/register`, {
        email,
        password,
        firstName: 'Test',
        lastName: role,
        tenantId,
        recaptchaToken: 'mock-token',
      });

      const dbUser = await prisma.user.findFirst({
        where: { email, tenantId },
      });
      if (!dbUser) throw new Error(`Failed to find registered user ${email}`);

      createdUserIds.push(dbUser.id);

      await prisma.user.update({
        where: { id: dbUser.id },
        data: { isVerified: true, role },
      });

      const loginRes = (await axios.post(`${BASE_URL}/auth/login`, {
        password,
        tenantId,
        identifier: email,
        recaptchaToken: 'mock-token',
      })) as any;

      return {
        id: dbUser.id,
        token: loginRes.data.token,
      };
    }

    // =========================================================================
    // STEP 1: SETUP DATA
    // =========================================================================
    await testStep(
      '1. Setup Users, Course, Modules, and Enrollment',
      async () => {
        const uInstructor = await setupUser(emailInstructor, 'instructor');
        tokenInstructor = uInstructor.token;
        userIdInstructor = uInstructor.id;

        const uStudent = await setupUser(emailStudent, 'student');
        tokenStudent = uStudent.token;
        userIdStudent = uStudent.id;

        // Create Course
        const resCourse = (await axios.post(
          `${BASE_URL}/courses`,
          {
            title: 'Progress Course',
            description: 'A course for testing progress',
            price: 0,
            isPublished: true,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenInstructor}`,
              'x-tenant-id': tenantId,
            },
          }
        )) as any;
        courseId = resCourse.data.data.id;

        // Create Modules
        const resMod1 = (await axios.post(
          `${BASE_URL}/modules`,
          {
            courseId,
            title: 'Module 1',
            orderIndex: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenInstructor}`,
              'x-tenant-id': tenantId,
            },
          }
        )) as any;
        module1Id = resMod1.data.data.id;

        const resMod2 = (await axios.post(
          `${BASE_URL}/modules`,
          {
            courseId,
            title: 'Module 2',
            orderIndex: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenInstructor}`,
              'x-tenant-id': tenantId,
            },
          }
        )) as any;
        module2Id = resMod2.data.data.id;

        // Publish Course
        await axios.put(
          `${BASE_URL}/courses/${courseId}/publish`,
          { isPublished: true },
          {
            headers: {
              Authorization: `Bearer ${tokenInstructor}`,
              'x-tenant-id': tenantId,
            },
          }
        );

        // Enroll Student
        await axios.post(
          `${BASE_URL}/courses/${courseId}/enroll`,
          {},
          {
            headers: {
              Authorization: `Bearer ${tokenStudent}`,
              'x-tenant-id': tenantId,
            },
          }
        );
      }
    );

    // =========================================================================
    // STEP 2: MODULE UNLOCKING SEQUENCE
    // =========================================================================
    await testStep('2.1 Initial Course Modules unlock state', async () => {
      const res = await axios.get(`${BASE_URL}/progress/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${tokenStudent}`,
          'x-tenant-id': tenantId,
        },
      });

      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      const modules = res.data.data;

      const mod1 = modules.find((m: any) => m.id === module1Id);
      const mod2 = modules.find((m: any) => m.id === module2Id);

      if (!mod1.isUnlocked) throw new Error('First module should be unlocked');
      if (mod2.isUnlocked)
        throw new Error('Second module should be locked initially');
    });

    await testStep(
      '2.2 Prevent updating progress on locked module',
      async () => {
        try {
          await axios.put(
            `${BASE_URL}/progress/module/${module2Id}`,
            { progressPercentage: 50 },
            {
              headers: {
                Authorization: `Bearer ${tokenStudent}`,
                'x-tenant-id': tenantId,
              },
            }
          );
          throw new Error('Expected 403 Forbidden but succeeded');
        } catch (err: any) {
          if (!err.response || err.response.status !== 403) throw err;
        }
      }
    );

    await testStep(
      '2.3 Update progress on unlocked module (Module 1)',
      async () => {
        const res = await axios.put(
          `${BASE_URL}/progress/module/${module1Id}`,
          { progressPercentage: 50, completed: false },
          {
            headers: {
              Authorization: `Bearer ${tokenStudent}`,
              'x-tenant-id': tenantId,
            },
          }
        );

        if (res.status !== 200)
          throw new Error(`Expected 200, got ${res.status}`);
        if (res.data.data.progressPercentage !== 50)
          throw new Error('Progress percentage not updated');
        if (res.data.data.completed !== false)
          throw new Error('Completed status should be false');
      }
    );

    await testStep(
      '2.4 Complete Module 1 and verify Module 2 unlocks',
      async () => {
        // Complete Module 1
        await axios.put(
          `${BASE_URL}/progress/module/${module1Id}`,
          { progressPercentage: 100, completed: true },
          {
            headers: {
              Authorization: `Bearer ${tokenStudent}`,
              'x-tenant-id': tenantId,
            },
          }
        );

        // Fetch modules again
        const res = await axios.get(`${BASE_URL}/progress/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${tokenStudent}`,
            'x-tenant-id': tenantId,
          },
        });

        const modules = res.data.data;
        const mod2 = modules.find((m: any) => m.id === module2Id);

        if (!mod2.isUnlocked)
          throw new Error(
            'Module 2 should be unlocked after Module 1 is completed'
          );
      }
    );

    // =========================================================================
    // STEP 3: COURSE COMPLETION TRIGGER
    // =========================================================================
    await testStep(
      '3.1 Complete Course and check Enrollment promotion',
      async () => {
        // Complete Module 2
        await axios.put(
          `${BASE_URL}/progress/module/${module2Id}`,
          { progressPercentage: 100, completed: true },
          {
            headers: {
              Authorization: `Bearer ${tokenStudent}`,
              'x-tenant-id': tenantId,
            },
          }
        );

        // Check enrollment status in DB
        const enrollment = await prisma.enrollment.findUnique({
          where: {
            studentId_courseId: {
              studentId: userIdStudent,
              courseId,
            },
          },
        });

        if (enrollment?.status !== 'completed') {
          throw new Error(
            `Expected enrollment status 'completed', got ${enrollment?.status}`
          );
        }
      }
    );

    // =========================================================================
    // STEP 4: DASHBOARD STATS
    // =========================================================================
    await testStep('4.1 Verify Dashboard Stats', async () => {
      const res = await axios.get(`${BASE_URL}/progress/dashboard`, {
        headers: {
          Authorization: `Bearer ${tokenStudent}`,
          'x-tenant-id': tenantId,
        },
      });

      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      const stats = res.data.data;

      if (stats.totalEnrolled !== 1)
        throw new Error('Total enrolled should be 1');
      if (stats.activeCourses !== 0)
        throw new Error(
          'Active courses should be 0 (because it was completed)'
        );
      if (stats.completedCourses !== 1)
        throw new Error('Completed courses should be 1');
      if (stats.averageProgress !== 100)
        throw new Error('Average progress should be 100');
    });
  } finally {
    // Clean up created users from DB
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
      console.log(
        `\n🧹 Cleaned up ${createdUserIds.length} test users from database.`
      );
    }

    await prisma.$disconnect();

    console.log('\n======================================');
    console.log(`🏁 Progress System test run completed:`);
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

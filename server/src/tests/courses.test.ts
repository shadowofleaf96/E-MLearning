import axios from 'axios';
import prisma from '../shared/database/prisma';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Course Core Model Integration Tests...\n');

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

    const emailInstructorA = `instructor-a-${randomSuffix}@test.local`;
    const emailInstructorB = `instructor-b-${randomSuffix}@test.local`;
    const emailStudent = `student-${randomSuffix}@test.local`;

    let tokenInstructorA = '';
    let tokenInstructorB = '';
    let tokenStudent = '';

    let userIdInstructorA = '';
    let userIdInstructorB = '';
    let userIdStudent = '';

    let courseId = '';
    let module1Id = '';
    let module2Id = '';
    let lessonId = '';

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

      // Save ID for cleanup
      createdUserIds.push(dbUser.id);

      // Verify email
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { isVerified: true, role },
      });

      // Login
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
    // STEP 1: USER SETUP
    // =========================================================================
    await testStep(
      '1. Setup Instructor A, Instructor B, and Student',
      async () => {
        const uA = await setupUser(emailInstructorA, 'instructor');
        tokenInstructorA = uA.token;
        userIdInstructorA = uA.id;

        const uB = await setupUser(emailInstructorB, 'instructor');
        tokenInstructorB = uB.token;
        userIdInstructorB = uB.id;

        const uStudent = await setupUser(emailStudent, 'student');
        tokenStudent = uStudent.token;
        userIdStudent = uStudent.id;

        console.log(`   Instructor A: ${emailInstructorA}`);
        console.log(`   Instructor B: ${emailInstructorB}`);
        console.log(`   Student: ${emailStudent}`);
      }
    );

    // =========================================================================
    // STEP 2: COURSE CRUD & PERMISSIONS
    // =========================================================================
    await testStep(
      '2.1 Instructor A creates Course A (unpublished)',
      async () => {
        const res = (await axios.post(
          `${BASE_URL}/courses`,
          {
            title: 'Introduction to Programming',
            description: 'A beginner course',
            price: 49.99,
            isPublished: false,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenInstructorA}`,
              'x-tenant-id': tenantId,
            },
          }
        )) as any;

        if (res.status !== 201)
          throw new Error(`Expected 201, got ${res.status}`);
        courseId = res.data.data.id;
        if (!courseId) throw new Error('Course ID not returned');
        if (res.data.data.instructorId !== userIdInstructorA) {
          throw new Error('Course instructor mismatch');
        }
      }
    );

    await testStep(
      '2.2 Instructor B tries to update Course A (Fail - Forbidden)',
      async () => {
        try {
          await axios.put(
            `${BASE_URL}/courses/${courseId}`,
            { title: 'Hacked Title' },
            {
              headers: {
                Authorization: `Bearer ${tokenInstructorB}`,
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
      '2.3 Instructor A updates Course A description & price (Success)',
      async () => {
        const res = (await axios.put(
          `${BASE_URL}/courses/${courseId}`,
          { description: 'An updated beginner course', price: 29.99 },
          {
            headers: {
              Authorization: `Bearer ${tokenInstructorA}`,
              'x-tenant-id': tenantId,
            },
          }
        )) as any;

        if (res.status !== 200)
          throw new Error(`Expected 200, got ${res.status}`);
        if (Number(res.data.data.price) !== 29.99)
          throw new Error('Price was not updated');
      }
    );

    await testStep(
      '2.4 Student tries to retrieve Course A (Fail - Forbidden because unpublished)',
      async () => {
        try {
          await axios.get(`${BASE_URL}/courses/${courseId}`, {
            headers: {
              Authorization: `Bearer ${tokenStudent}`,
              'x-tenant-id': tenantId,
            },
          });
          throw new Error('Expected 403 Forbidden but succeeded');
        } catch (err: any) {
          if (!err.response || err.response.status !== 403) throw err;
        }
      }
    );

    // =========================================================================
    // STEP 3: MODULE CRUD
    // =========================================================================
    await testStep(
      '3.1 Instructor A creates two modules for Course A',
      async () => {
        const res1 = (await axios.post(
          `${BASE_URL}/modules`,
          {
            courseId,
            title: 'Module 1: Getting Started',
            orderIndex: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenInstructorA}`,
              'x-tenant-id': tenantId,
            },
          }
        )) as any;
        if (res1.status !== 201)
          throw new Error(`Failed to create Module 1, status ${res1.status}`);
        module1Id = res1.data.data.id;

        const res2 = (await axios.post(
          `${BASE_URL}/modules`,
          {
            courseId,
            title: 'Module 2: Advanced Concepts',
            orderIndex: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenInstructorA}`,
              'x-tenant-id': tenantId,
            },
          }
        )) as any;
        if (res2.status !== 201)
          throw new Error(`Failed to create Module 2, status ${res2.status}`);
        module2Id = res2.data.data.id;
      }
    );

    await testStep(
      '3.2 Instructor B tries to create Module in Course A (Fail - Forbidden)',
      async () => {
        try {
          await axios.post(
            `${BASE_URL}/modules`,
            {
              courseId,
              title: 'Hacked Module',
              orderIndex: 2,
            },
            {
              headers: {
                Authorization: `Bearer ${tokenInstructorB}`,
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
      '3.3 Instructor A reorders Module 1 and Module 2',
      async () => {
        const res = (await axios.put(
          `${BASE_URL}/modules/reorder`,
          {
            courseId,
            modules: [
              { id: module1Id, orderIndex: 1 },
              { id: module2Id, orderIndex: 0 },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${tokenInstructorA}`,
              'x-tenant-id': tenantId,
            },
          }
        )) as any;
        if (res.status !== 200)
          throw new Error(`Expected 200, got ${res.status}`);

        // Verify order by fetching course details
        const courseRes = (await axios.get(`${BASE_URL}/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${tokenInstructorA}`,
            'x-tenant-id': tenantId,
          },
        })) as any;

        const modules = courseRes.data.data.modules;
        if (modules[0].id !== module2Id || modules[1].id !== module1Id) {
          throw new Error('Reordering failed. Modules order is incorrect.');
        }
      }
    );

    // =========================================================================
    // STEP 4: LESSON CRUD
    // =========================================================================
    await testStep(
      '4.1 Instructor A creates a lesson in Module 1',
      async () => {
        const res = (await axios.post(
          `${BASE_URL}/lessons`,
          {
            moduleId: module1Id,
            title: 'Lesson 1.1: Hello World',
            type: 'text',
            content: 'This is the first lesson content',
          },
          {
            headers: {
              Authorization: `Bearer ${tokenInstructorA}`,
              'x-tenant-id': tenantId,
            },
          }
        )) as any;
        if (res.status !== 201)
          throw new Error(`Failed to create lesson, status ${res.status}`);
        lessonId = res.data.data.id;
      }
    );

    await testStep(
      '4.2 Instructor B tries to create lesson in Module 1 (Fail - Forbidden)',
      async () => {
        try {
          await axios.post(
            `${BASE_URL}/lessons`,
            {
              moduleId: module1Id,
              title: 'Hacked Lesson',
              type: 'text',
            },
            {
              headers: {
                Authorization: `Bearer ${tokenInstructorB}`,
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

    // =========================================================================
    // STEP 5: PUBLISHING & STUDENT ENROLLMENT
    // =========================================================================
    await testStep(
      '5.1 Student tries to enroll in Course A (Fail - BadRequest because unpublished)',
      async () => {
        try {
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
          throw new Error('Expected 400 Bad Request but succeeded');
        } catch (err: any) {
          if (!err.response || err.response.status !== 400) throw err;
        }
      }
    );

    await testStep('5.2 Instructor A publishes Course A', async () => {
      const res = (await axios.put(
        `${BASE_URL}/courses/${courseId}/publish`,
        { isPublished: true },
        {
          headers: {
            Authorization: `Bearer ${tokenInstructorA}`,
            'x-tenant-id': tenantId,
          },
        }
      )) as any;
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      if (res.data.data.isPublished !== true)
        throw new Error('Course isPublished was not set to true');
    });

    await testStep(
      '5.3 Student retrieves Course A details (Success now that published)',
      async () => {
        const res = (await axios.get(`${BASE_URL}/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${tokenStudent}`,
            'x-tenant-id': tenantId,
          },
        })) as any;
        if (res.status !== 200)
          throw new Error(`Expected 200, got ${res.status}`);
        if (res.data.data.title !== 'Introduction to Programming') {
          throw new Error('Retrieved incorrect course details');
        }
      }
    );

    await testStep('5.4 Student enrolls in Course A (Success)', async () => {
      const res = (await axios.post(
        `${BASE_URL}/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenStudent}`,
            'x-tenant-id': tenantId,
          },
        }
      )) as any;
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);
      if (
        res.data.data.studentId !== userIdStudent ||
        res.data.data.courseId !== courseId
      ) {
        throw new Error('Enrollment record details mismatch');
      }
    });

    // =========================================================================
    // STEP 6: DELETION & CASCADE
    // =========================================================================
    await testStep(
      '6.1 Instructor B tries to delete Course A (Fail - Forbidden)',
      async () => {
        try {
          await axios.delete(`${BASE_URL}/courses/${courseId}`, {
            headers: {
              Authorization: `Bearer ${tokenInstructorB}`,
              'x-tenant-id': tenantId,
            },
          });
          throw new Error('Expected 403 Forbidden but succeeded');
        } catch (err: any) {
          if (!err.response || err.response.status !== 403) throw err;
        }
      }
    );

    await testStep('6.2 Instructor A deletes Course A (Success)', async () => {
      const res = (await axios.delete(`${BASE_URL}/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${tokenInstructorA}`,
          'x-tenant-id': tenantId,
        },
      })) as any;
      if (res.status !== 200)
        throw new Error(`Expected 200, got ${res.status}`);

      // Verify cascading delete in database
      const dbCourse = await prisma.course.findUnique({
        where: { id: courseId },
      });
      const dbModule = await prisma.module.findUnique({
        where: { id: module1Id },
      });
      const dbLesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
      });

      if (dbCourse) throw new Error('Course was not deleted');
      if (dbModule) throw new Error('Module was not cascade-deleted');
      if (dbLesson) throw new Error('Lesson was not cascade-deleted');
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
    console.log(`🏁 Course Core Model test run completed:`);
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

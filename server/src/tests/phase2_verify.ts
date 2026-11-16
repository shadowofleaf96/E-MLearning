import prisma from '../shared/database/prisma';
import { messagingService } from '../modules/messaging/messaging.service';
import { assignmentsService } from '../modules/assignments/assignments.service';
import { modulesService } from '../modules/modules/modules.service';
import { lessonsService } from '../modules/lessons/lessons.service';

async function runPhase2Verification() {
  console.log('=== PHASE 2 (INSTRUCTOR PRODUCTIVITY) BACKEND VERIFICATION ===\n');

  // 1. Resolve Tenant, Instructor, Student, Course
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error('No tenant found');
  console.log(`[Setup] Tenant: ${tenant.name} (${tenant.id})`);

  let instructor = await prisma.user.findFirst({
    where: { tenantId: tenant.id, role: 'instructor' },
  });
  if (!instructor) {
    instructor = await prisma.user.findFirst({ where: { tenantId: tenant.id } });
  }
  if (!instructor) throw new Error('No user found');
  console.log(`[Setup] Instructor: ${instructor.firstName} ${instructor.lastName} (${instructor.id})`);

  let student = await prisma.user.findFirst({
    where: { tenantId: tenant.id, role: 'student', id: { not: instructor.id } },
  });
  if (!student) {
    student = await prisma.user.findFirst({
      where: { tenantId: tenant.id, id: { not: instructor.id } },
    });
  }
  if (!student) throw new Error('No student found');
  console.log(`[Setup] Student: ${student.firstName} ${student.lastName} (${student.id})`);

  const course = await prisma.course.findFirst({
    where: { tenantId: tenant.id },
    include: { modules: { include: { lessons: true } } },
  });
  if (!course || !course.modules.length) throw new Error('No course with modules found');
  const targetModule = course.modules[0];
  const targetLesson = targetModule.lessons[0];
  console.log(`[Setup] Course: "${course.title}", Module: "${targetModule.title}"`);

  // Ensure student is enrolled
  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: course.id,
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      studentId: student.id,
      courseId: course.id,
      status: 'active',
    },
  });

  // -------------------------------------------------------------
  // TEST 1: IN-PLATFORM MESSAGING (1:1 Chat)
  // -------------------------------------------------------------
  console.log('\n--- Test 1: In-Platform Messaging ---');

  // Student sends message to Instructor
  const msgFromStudent = await messagingService.sendMessage(
    tenant.id,
    student.id,
    {
      recipientId: instructor.id,
      content: 'Hi instructor, I have a question regarding the recent assignment rubric!',
    }
  );
  console.log('✓ Student sent message:', msgFromStudent.id, 'Conversation:', msgFromStudent.conversationId);

  // Instructor checks unread counter
  const unreadRes = await messagingService.getUnreadCount(tenant.id, instructor.id);
  console.log(`✓ Instructor unread messages count: ${unreadRes.unreadCount}`);
  if (unreadRes.unreadCount < 1) throw new Error('Expected at least 1 unread message for instructor');

  // Instructor fetches conversation list
  const conversations = await messagingService.getConversations(tenant.id, instructor.id);
  const foundConv = conversations.find((c) => c.id === msgFromStudent.conversationId);
  if (!foundConv) throw new Error('Conversation not found in instructor conversation list');
  console.log(`✓ Instructor fetched ${conversations.length} conversation(s). Latest message: "${foundConv.lastMessage?.content}"`);

  // Instructor opens the conversation (marks as read)
  const messages = await messagingService.getMessages(
    tenant.id,
    instructor.id,
    msgFromStudent.conversationId
  );
  console.log(`✓ Instructor loaded conversation: ${messages.length} message(s) loaded, marked as read.`);

  // Instructor replies back to Student
  const replyMsg = await messagingService.sendMessage(
    tenant.id,
    instructor.id,
    {
      recipientId: student.id,
      content: 'Hello! The rubric rewards clean formatting and rigorous test coverage.',
    }
  );
  console.log('✓ Instructor replied:', replyMsg.id, `"${replyMsg.content}"`);

  // Student checks unread count
  const studentUnread = await messagingService.getUnreadCount(tenant.id, student.id);
  console.log(`✓ Student unread messages count: ${studentUnread.unreadCount}`);
  if (studentUnread.unreadCount < 1) throw new Error('Expected at least 1 unread message for student');

  // -------------------------------------------------------------
  // TEST 2: ASSIGNMENT CREATION, SUBMISSION & GRADING
  // -------------------------------------------------------------
  console.log('\n--- Test 2: Assignment & Submission System ---');

  // Instructor creates an assignment on targetModule
  const testAssignment = await assignmentsService.createAssignment(
    tenant.id,
    {
      moduleId: targetModule.id,
      title: `Project Milestone #${Date.now().toString().slice(-4)}`,
      description: 'Implement a comprehensive REST client and submit your repository link.',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      maxScore: 100,
    }
  );
  console.log('✓ Assignment created:', testAssignment.id, `"${testAssignment.title}"`);

  // Verify assignment is listed for module
  const moduleAssignments = await assignmentsService.getModuleAssignments(
    tenant.id,
    targetModule.id
  );
  const foundAssignment = moduleAssignments.find((a) => a.id === testAssignment.id);
  if (!foundAssignment) throw new Error('Created assignment not found in module assignments query');
  console.log(`✓ Module has ${moduleAssignments.length} assignment(s) found.`);

  // Student submits the assignment
  const submission = await assignmentsService.submitAssignment(
    tenant.id,
    student.id,
    {
      assignmentId: testAssignment.id,
      content: 'Here is my project implementation with full test suite passing.',
      fileUrl: 'https://github.com/example/full-saas-lms-solution',
    }
  );
  console.log('✓ Student submitted assignment:', submission.id);

  // Instructor inspects all submissions for this assignment
  const submissionsList = await assignmentsService.getAssignmentSubmissions(
    tenant.id,
    testAssignment.id
  );
  const foundSub = submissionsList.find((s) => s.id === submission.id);
  if (!foundSub) throw new Error('Submission not found in instructor assignment submissions list');
  console.log(`✓ Instructor fetched ${submissionsList.length} submission(s). Student: ${foundSub.student.firstName}`);

  // Instructor grades the submission
  const gradedSubmission = await assignmentsService.gradeSubmission(
    tenant.id,
    submission.id,
    {
      grade: 96,
      feedback: 'Splendid implementation! Architecture and error handling exceeded standards.',
    }
  );
  console.log('✓ Instructor graded submission:', gradedSubmission.id, 'Grade:', gradedSubmission.grade);
  if (gradedSubmission.grade !== 96) {
    throw new Error('Graded submission failed validation checks');
  }

  // -------------------------------------------------------------
  // TEST 3: CONTENT SCHEDULING (DRIP RELEASE)
  // -------------------------------------------------------------
  console.log('\n--- Test 3: Course Content Scheduling (Drip Release) ---');

  const futureDate = new Date(Date.now() + 86400000 * 14); // 14 days in future

  // Schedule Module
  const updatedModule = await modulesService.updateModule(
    targetModule.id,
    { publishAt: futureDate.toISOString() },
    tenant.id,
    course.instructorId || instructor.id,
    'instructor'
  );
  console.log('✓ Module scheduled publishAt:', updatedModule.publishAt?.toISOString());
  if (!updatedModule.publishAt) throw new Error('Module publishAt was not saved');

  // Schedule Lesson (if lesson exists)
  if (targetLesson) {
    const updatedLesson = await lessonsService.updateLesson(
      targetLesson.id,
      { publishAt: futureDate.toISOString() },
      tenant.id,
      course.instructorId || instructor.id,
      'instructor'
    );
    console.log('✓ Lesson scheduled publishAt:', updatedLesson.publishAt?.toISOString());
    if (!updatedLesson.publishAt) throw new Error('Lesson publishAt was not saved');

    // Reset lesson publishAt to null for normal test state
    await lessonsService.updateLesson(
      targetLesson.id,
      { publishAt: null },
      tenant.id,
      course.instructorId || instructor.id,
      'instructor'
    );
    console.log('✓ Lesson publishAt reset to null successfully.');
  }

  // Reset module publishAt to null
  await modulesService.updateModule(
    targetModule.id,
    { publishAt: null },
    tenant.id,
    course.instructorId || instructor.id,
    'instructor'
  );
  console.log('✓ Module publishAt reset to null successfully.');

  console.log('\n=============================================================');
  console.log('🎉 ALL PHASE 2 BACKEND & DATABASE VERIFICATIONS PASSED! 🎉');
  console.log('=============================================================');
}

runPhase2Verification()
  .catch((err) => {
    console.error('\n❌ Verification Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

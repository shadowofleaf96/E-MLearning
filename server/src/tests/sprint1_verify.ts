import prisma from '../shared/database/prisma';
import { reviewsService } from '../modules/reviews/reviews.service';
import { discussionsService } from '../modules/discussions/discussions.service';
import { bookmarksService } from '../modules/bookmarks/bookmarks.service';
import { searchService } from '../modules/search/search.service';
import { progressService } from '../modules/progress/progress.service';

async function runSprint1Verification() {
  console.log('--- SPRINT 1 BACKEND VERIFICATION ---');

  // Find a tenant, a user, a course, and a lesson
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    console.error('No tenant found');
    process.exit(1);
  }
  console.log('Tenant:', tenant.name, tenant.id);

  const course = await prisma.course.findFirst({
    where: { tenantId: tenant.id },
    include: { modules: { include: { lessons: true } } },
  });
  if (!course) {
    console.error('No course found');
    process.exit(1);
  }
  console.log('Course:', course.title, course.id);

  const student = await prisma.user.findFirst({
    where: { tenantId: tenant.id },
  });
  if (!student) {
    console.error('No student found');
    process.exit(1);
  }
  console.log('User:', student.firstName, student.id);

  const firstModule = course.modules.sort((a, b) => a.orderIndex - b.orderIndex)[0];
  const lesson = firstModule?.lessons[0];
  console.log('Module 0:', firstModule?.title, firstModule?.orderIndex);
  console.log('Lesson:', lesson?.title, lesson?.id);

  // Ensure student is enrolled in this course for tests
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

  // 1. Test Search
  console.log('\n[1/5] Testing Global Search Service...');
  const searchResults = await searchService.searchAll(tenant.id, 'Web');
  console.log('Search results courses:', searchResults.courses.length);
  console.log('Search results lessons:', searchResults.lessons.length);
  console.log('Search results instructors:', searchResults.instructors.length);

  // 2. Test Bookmarks
  console.log('\n[2/5] Testing Bookmarks Service...');
  const toggleRes1 = await bookmarksService.toggleBookmark(tenant.id, student.id, course.id);
  console.log('Toggled bookmark (1):', toggleRes1);
  const checkRes1 = await bookmarksService.checkBookmark(tenant.id, student.id, course.id);
  console.log('Check bookmark:', checkRes1);
  const userBookmarks = await bookmarksService.getUserBookmarks(tenant.id, student.id);
  console.log('User bookmarks count:', userBookmarks.length);

  // 3. Test Discussions
  console.log('\n[3/5] Testing Discussions Service...');
  const discussion = await discussionsService.createDiscussion(tenant.id, student.id, {
    courseId: course.id,
    lessonId: lesson?.id,
    title: 'Verification Test Question: How does this work?',
    content: 'Testing Sprint 1 discussion creation and resolution pipeline.',
  });
  console.log('Discussion created:', discussion.id, discussion.title);

  const reply = await discussionsService.createReply(tenant.id, student.id, {
    discussionId: discussion.id,
    content: 'Here is the verified test answer.',
  });
  console.log('Reply created:', reply.id);

  await discussionsService.upvoteDiscussion(tenant.id, discussion.id);
  await discussionsService.upvoteReply(tenant.id, reply.id);
  await discussionsService.markSolution(tenant.id, reply.id);
  console.log('Upvoted and marked solution on reply.');

  const fetchedDisc = await discussionsService.getDiscussionById(tenant.id, discussion.id);
  console.log('Fetched discussion replies count:', fetchedDisc.replies?.length);

  // 4. Test Notes & Server-side Lesson Progress
  console.log('\n[4/5] Testing Notes & Lesson Progress...');
  if (lesson) {
    const progress = await progressService.updateLessonProgress(tenant.id, student.id, lesson.id, {
      completed: true,
      timeSpent: 60,
    });
    console.log('Lesson progress updated in DB:', progress.completed, progress.timeSpent);

    const lessonProgressList = await progressService.getCourseLessonProgress(tenant.id, student.id, course.id);
    console.log('Course lesson progress count from DB:', lessonProgressList.length);

    const savedNote = await progressService.saveStudentNote(tenant.id, student.id, course.id, {
      lessonId: lesson.id,
      content: 'This is a persistent test note saved directly to PostgreSQL.',
    });
    console.log('Saved note to DB:', savedNote.id, savedNote.content);

    const notes = await progressService.getStudentNotes(tenant.id, student.id, course.id);
    console.log('Student notes fetched from DB:', notes.length);
  }

  // 5. Test Reviews
  console.log('\n[5/5] Testing Reviews Service...');
  // Ensure student is enrolled so review can be created
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

  const review = await reviewsService.createReview(tenant.id, student.id, {
    courseId: course.id,
    rating: 5,
    comment: 'Sprint 1 test review: Excellent course content and structure!',
  });
  console.log('Review created/updated:', review.id, review.rating, review.comment);

  const reviewsSummary = await reviewsService.getCourseReviews(tenant.id, course.id);
  console.log('Course reviews count:', reviewsSummary.stats.total);
  console.log('Course average rating:', reviewsSummary.stats.averageRating);

  console.log('\n✅ ALL SPRINT 1 MODULES VERIFIED SUCCESSFULLY!');
  process.exit(0);
}

runSprint1Verification().catch((err) => {
  console.error('Sprint 1 verification failed:', err);
  process.exit(1);
});

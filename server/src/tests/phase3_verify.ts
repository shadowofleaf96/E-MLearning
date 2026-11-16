import prisma from '../shared/database/prisma';
import { categoriesService } from '../modules/categories/categories.service';
import { tagsService } from '../modules/tags/tags.service';
import { coursesService } from '../modules/courses/courses.service';
import { campaignsService } from '../modules/notifications/campaigns.service';
import { paymentsService } from '../modules/payments/payments.service';
import { notificationsService } from '../modules/notifications/notifications.service';

async function runPhase3Verification() {
  console.log('--- STARTING PHASE 3 VERIFICATION ---');

  // Find or create test tenant
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'Test Tenant Phase 3',
        slug: 'test-tenant-phase-3-' + Date.now(),
      },
    });
  }

  // Find or create instructor & admin
  let instructor = await prisma.user.findFirst({
    where: { tenantId: tenant.id, role: 'instructor' },
  });
  if (!instructor) {
    instructor = await prisma.user.create({
      data: {
        email: `instructor_p3_${Date.now()}@test.com`,
        password: 'dummy',
        firstName: 'Prof',
        lastName: 'Oak',
        role: 'instructor',
        tenantId: tenant.id,
      },
    });
  }

  let admin = await prisma.user.findFirst({
    where: { tenantId: tenant.id, role: 'admin' },
  });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: `admin_p3_${Date.now()}@test.com`,
        password: 'dummy',
        firstName: 'Chief',
        lastName: 'Admin',
        role: 'admin',
        tenantId: tenant.id,
      },
    });
  }

  // ─── TEST 1: CATEGORY HIERARCHY & TREE ───
  console.log('\n[TEST 1] Category Hierarchy & Tree:');
  const parentCat = await categoriesService.createCategory(
    {
      name: `Parent Tech ${Date.now()}`,
      description: 'Parent category for technology',
    },
    tenant.id
  );
  console.log('✓ Created parent category:', parentCat.id, parentCat.name);

  const childCat = await categoriesService.createCategory(
    {
      name: `Web Dev ${Date.now()}`,
      parentId: parentCat.id,
      description: 'Subcategory for web development',
    },
    tenant.id
  );
  console.log('✓ Created child category with parentId:', childCat.id, childCat.parentId);

  const tree = await categoriesService.getCategoryTree(tenant.id);
  const foundInTree = tree.find((c: any) => c.id === parentCat.id);
  if (!foundInTree || !foundInTree.children.some((sub: any) => sub.id === childCat.id)) {
    throw new Error('Category hierarchy tree does not contain nested child category');
  }
  console.log('✓ Category hierarchy verified in tree structure');

  // ─── TEST 2: TAG MANAGEMENT ───
  console.log('\n[TEST 2] Tag Management:');
  const tag1 = await tagsService.createTag(`React-${Date.now()}`, tenant.id);
  const tag2 = await tagsService.createTag(`NodeJS-${Date.now()}`, tenant.id);
  console.log('✓ Created tags:', tag1.name, tag2.name);

  const course = await prisma.course.create({
    data: {
      tenantId: tenant.id,
      instructorId: instructor.id,
      title: 'Fullstack Next.js Masterclass ' + Date.now(),
      description: 'Deep dive into SaaS development',
      price: 99.99,
      categoryId: childCat.id,
      isPublished: false,
      moderationStatus: 'draft',
    },
  });
  console.log('✓ Created test course:', course.id);

  const assignedTags = await tagsService.assignCourseTags(
    course.id,
    [tag1.id, tag2.id],
    tenant.id
  );
  if (assignedTags.length !== 2) {
    throw new Error(`Expected 2 assigned tags, got ${assignedTags.length}`);
  }
  console.log('✓ Assigned 2 tags to course successfully');

  // ─── TEST 3: COURSE MODERATION WORKFLOW ───
  console.log('\n[TEST 3] Course Moderation Workflow:');
  // 3a. Instructor submits for review
  const submitted = await coursesService.submitForReview(
    course.id,
    tenant.id,
    instructor.id
  );
  if (submitted.moderationStatus !== 'pending_review') {
    throw new Error('Expected moderationStatus to be pending_review');
  }
  console.log('✓ Course submitted for review, status:', submitted.moderationStatus);

  // 3b. Admin requests revision with notes
  const revisionCourse = await coursesService.moderateCourse(
    course.id,
    tenant.id,
    admin.id,
    'request_revision',
    'Please add more course modules and update video lessons.'
  );
  if (revisionCourse.moderationStatus !== 'needs_revision' || revisionCourse.isPublished) {
    throw new Error('Expected moderationStatus to be needs_revision and isPublished false');
  }
  console.log('✓ Admin requested revision with comment, status:', revisionCourse.moderationStatus);

  // 3c. Verify instructor notification was sent
  const instructorNotifs = await notificationsService.getNotifications(
    tenant.id,
    instructor.id,
    5
  );
  const revNotif = instructorNotifs.find((n) => n.title.includes('Revision Requested'));
  if (!revNotif) {
    throw new Error('Instructor did not receive revision notification');
  }
  console.log('✓ Instructor notification received:', revNotif.title, 'Message:', revNotif.message);

  // 3d. Verify moderation logs history
  const logs = await coursesService.getModerationLogs(course.id, tenant.id);
  if (logs.length < 2) {
    throw new Error(`Expected at least 2 moderation logs, got ${logs.length}`);
  }
  console.log('✓ Moderation logs history count:', logs.length);

  // 3e. Admin approves course
  const approvedCourse = await coursesService.moderateCourse(
    course.id,
    tenant.id,
    admin.id,
    'approve',
    'Great updates! Course approved for public catalog.'
  );
  if (approvedCourse.moderationStatus !== 'approved' || !approvedCourse.isPublished) {
    throw new Error('Expected course to be approved and published');
  }
  console.log('✓ Course approved & published successfully');

  // ─── TEST 4: EMAIL CAMPAIGN & AUDIENCE DISPATCH ───
  console.log('\n[TEST 4] Bulk Campaign Dispatch:');
  const campaign = await campaignsService.createCampaign(tenant.id, {
    name: 'Winter Sale 2026',
    subject: 'Special 50% Off On All Tech Courses!',
    content: 'Enroll today to claim your limited discount coupon.',
    status: 'Draft',
  });
  console.log('✓ Created draft campaign:', campaign.id);

  const dispatchResult = await campaignsService.sendCampaign(
    tenant.id,
    campaign.id,
    { targetAudience: 'All Users' }
  );
  if (dispatchResult.campaign.status !== 'Sent' || dispatchResult.recipients < 1) {
    throw new Error('Campaign dispatch did not mark status Sent or dispatch to recipients');
  }
  console.log(`✓ Campaign sent to ${dispatchResult.recipients} recipients, status: ${dispatchResult.campaign.status}`);

  // ─── TEST 5: PAYOUT QUEUE & ADMIN APPROVAL ───
  console.log('\n[TEST 5] Instructor Payout Queue & Admin Approval:');
  const payout = await paymentsService.requestPayout(
    tenant.id,
    instructor.id,
    250.0,
    'Monthly course revenue withdrawal via Wise'
  );
  console.log('✓ Instructor created payout request:', payout.id, 'Amount:', payout.amount);

  const queue = await paymentsService.getAllPayoutRequests(tenant.id, 'pending');
  const foundPayout = queue.find((p) => p.id === payout.id);
  if (!foundPayout) {
    throw new Error('Payout not found in admin pending queue');
  }
  console.log('✓ Found payout in admin pending queue for instructor:', foundPayout.instructor.email);

  const paidPayout = await paymentsService.updatePayoutStatus(
    tenant.id,
    payout.id,
    'paid',
    'Transfer completed via Wise ref #WS-992384'
  );
  if (paidPayout.status !== 'paid') {
    throw new Error('Payout status was not updated to paid');
  }
  console.log('✓ Admin approved and marked payout as paid');

  const analytics = await paymentsService.getPaymentAnalytics(tenant.id);
  console.log('✓ Admin financial analytics:', {
    totalRevenue: analytics.totalRevenue,
    paidPayouts: analytics.paidPayouts,
    pendingPayouts: analytics.pendingPayouts,
  });

  console.log('\n✅ ALL PHASE 3 VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runPhase3Verification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ PHASE 3 VERIFICATION FAILED:', err);
    process.exit(1);
  });

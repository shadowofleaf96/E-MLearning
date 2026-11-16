import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'lumina-school' },
    update: {},
    create: {
      name: 'Lumina School',
      slug: 'lumina-school',
      domain: 'lumina.localhost',
      isActive: true,
      subscriptionPlan: 'professional',
    },
  });

  console.log('Created/Found tenant Lumina School with ID:', tenant.id);

  // Update all users to belong to this tenant
  const updateUsers = await prisma.user.updateMany({
    data: {
      tenantId: tenant.id,
    },
  });

  // Update all courses, modules, exams, etc. if they exist
  await prisma.course.updateMany({ data: { tenantId: tenant.id } });
  await prisma.module.updateMany({ data: { tenantId: tenant.id } });
  await prisma.exam.updateMany({ data: { tenantId: tenant.id } });

  console.log(`Updated ${updateUsers.count} users to belong to Lumina School.`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

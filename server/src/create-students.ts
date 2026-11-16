import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany();
  console.log('Available tenants:', tenants.map(t => ({ id: t.id, name: t.name, slug: t.slug })));

  let stanfordTenant = tenants.find(
    t => t.slug.toLowerCase().includes('stanford') || t.name.toLowerCase().includes('stanford')
  );

  if (!stanfordTenant) {
    console.log('No tenant with "stanford" in name/slug found. Using first tenant if available...');
    stanfordTenant = tenants[0];
  }

  if (!stanfordTenant) {
    console.error('No tenant found in database.');
    return;
  }

  console.log(`Using tenant: ${stanfordTenant.name} (${stanfordTenant.id}, slug: ${stanfordTenant.slug})`);

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const student1Data = {
    email: 'john.doe@stanford.edu',
    firstName: 'John',
    lastName: 'Doe',
    password: passwordHash,
    role: 'student' as const,
    tenantId: stanfordTenant.id,
    isVerified: true,
  };

  const student2Data = {
    email: 'alice.smith@stanford.edu',
    firstName: 'Alice',
    lastName: 'Smith',
    password: passwordHash,
    role: 'student' as const,
    tenantId: stanfordTenant.id,
    isVerified: true,
  };

  const s1 = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: student1Data.email,
        tenantId: stanfordTenant.id,
      },
    },
    update: { tenantId: stanfordTenant.id },
    create: student1Data,
  });

  const s2 = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: student2Data.email,
        tenantId: stanfordTenant.id,
      },
    },
    update: { tenantId: stanfordTenant.id },
    create: student2Data,
  });

  console.log('Successfully created/updated students:');
  console.log('Student 1:', { id: s1.id, email: s1.email, name: `${s1.firstName} ${s1.lastName}`, role: s1.role, tenantId: s1.tenantId });
  console.log('Student 2:', { id: s2.id, email: s2.email, name: `${s2.firstName} ${s2.lastName}`, role: s2.role, tenantId: s2.tenantId });
}

main()
  .catch((e) => {
    console.error('Error creating students:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash('password123', 10);
  
  // Find lumina tenant
  let tenant = await prisma.tenant.findFirst({ where: { slug: 'lumina' } });
  if (!tenant) {
    console.log('Lumina tenant not found, creating it...');
    tenant = await prisma.tenant.create({
      data: {
        name: 'Lumina Learning',
        slug: 'lumina',
        domain: 'lumina.local'
      }
    });
  }
  
  const tenantAdminUser = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'admin@lumina.local',
        tenantId: tenant.id,
      },
    },
    update: {
      password: defaultPassword,
      role: 'admin',
    },
    create: {
      firstName: 'Lumina',
      lastName: 'Admin',
      email: 'admin@lumina.local',
      password: defaultPassword,
      role: 'admin',
      isVerified: true,
      tenantId: tenant.id,
    },
  });
  
  console.log('✅ Lumina Admin created: ' + tenantAdminUser.email);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());

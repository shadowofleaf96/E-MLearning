import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Get the first tenant to use as a "system" tenant
    let tenant = await prisma.tenant.findFirst();
    
    if (!tenant) {
      console.log('No tenant found. Creating a default System Tenant...');
      tenant = await prisma.tenant.create({
        data: {
          name: 'System Tenant',
          slug: 'system',
          subscriptionPlan: 'enterprise',
        }
      });
    }

    // 2. Define Super Admin credentials
    const email = 'superadmin@modernscholastic.com';
    const plainPassword = 'SuperAdminPassword123!';

    // 3. Check if it already exists
    const existing = await prisma.user.findUnique({ where: { email_tenantId: { email, tenantId: tenant.id } } });
    if (existing) {
      console.log(`Super Admin already exists with email: ${email}`);
      console.log('Update the database manually if you need to reset the password.');
      return;
    }

    // 4. Create the Super Admin
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const superAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Admin',
        role: 'super_admin',
        tenantId: tenant.id,
      }
    });

    console.log('✅ Super Admin created successfully!');
    console.log('-------------------------------------------');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${plainPassword}`);
    console.log(`Role:     ${superAdmin.role}`);
    console.log(`Tenant:   ${tenant.name}`);
    console.log('-------------------------------------------');
    
  } catch (error) {
    console.error('Error creating Super Admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

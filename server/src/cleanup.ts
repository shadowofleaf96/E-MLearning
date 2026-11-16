import prisma from './shared/database/prisma';

async function main() {
  console.log('Cleaning up specified unwanted tenants...');

  // Find tenants matching E-Tactiques or Lumina Learning or domains
  const tenantsToDelete = await prisma.tenant.findMany({
    where: {
      OR: [
        { slug: 'e-tactiques' },
        { slug: 'lumina-learning' },
        { name: { contains: 'E-Tactiques', mode: 'insensitive' } },
        { name: { contains: 'Lumina Learning', mode: 'insensitive' } },
        { domain: { contains: 'etactiques', mode: 'insensitive' } },
        { domain: { contains: 'lumina', mode: 'insensitive' } },
      ],
    },
  });

  console.log(
    'Found tenants to delete:',
    tenantsToDelete.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      domain: t.domain,
    }))
  );

  for (const t of tenantsToDelete) {
    // Delete dependent users first if any to prevent foreign key errors
    await prisma.user.deleteMany({
      where: { tenantId: t.id },
    });

    await prisma.tenant.delete({
      where: { id: t.id },
    });
    console.log(`Deleted tenant: ${t.name} (${t.id})`);
  }

  const remaining = await prisma.tenant.findMany();
  console.log(
    'Remaining active tenants:',
    remaining.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      domain: t.domain,
    }))
  );

  process.exit(0);
}

main().catch((err) => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});

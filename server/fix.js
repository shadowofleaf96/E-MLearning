const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cat = await prisma.category.findFirst({where: {slug: 'web-development'}});
  if (cat) {
    const res = await prisma.course.updateMany({where: {title: {contains: 'Web'}}, data: {categoryId: cat.id}});
    console.log(res);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

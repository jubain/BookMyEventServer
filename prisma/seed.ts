import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  const Jubeen = await prisma.user.upsert({
    where: { email: 'jubeen@email.com' },
    update: {},
    create: {
      email: 'Jubeen@test.com',
      name: 'Jubeen',
      password: 'password',
      phone: 1231231,
      role: 'CUSTOMER',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  // const Jubeen = await prisma.user.upsert({
  //   where: { email: 'jubeen@email.com' },
  //   update: {},
  //   create: {
  //     email: 'Jubeen@test.com',
  //     name: 'Jubeen',
  //     password: 'String123!',
  //     phone: 1231231,
  //     role: 'CUSTOMER',
  //   },
  // });
  // const Type = await prisma.type.createMany({
  //   data: [
  //     { name: 'ANY' },
  //     { name: 'CLUB' },
  //     { name: 'CONVENTION' },
  //     { name: 'CORPORATE' },
  //     { name: 'FASHION' },
  //     { name: 'FESTIVAL' },
  //     { name: 'NETWORKING' },
  //     { name: 'SOCIAL' },
  //     { name: 'WEDDING' },
  //   ],
  // });
  // const EventType = await prisma.typeEvent.createMany({
  //   data: [
  //     { name: 'SPORTS' },
  //     { name: 'CHILDREN' },
  //     { name: 'ADULT' },
  //     { name: 'CARS' },
  //     { name: 'MOTOBIKE' },
  //     { name: 'GAME' },
  //     { name: 'TECHNOLOGY' },
  //   ],
  // });
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

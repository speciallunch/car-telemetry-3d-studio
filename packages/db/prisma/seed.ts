import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    const vehicle1 = await prisma.vehicle.upsert({
        where: { vin: 'TESLA-MODEL3-001' },
        update: {},
        create: {
            vin: 'TESLA-MODEL3-001',
            name: 'My Model 3',
            model: 'Model 3',
            year: 2023,
        },
    });

    const vehicle2 = await prisma.vehicle.upsert({
        where: { vin: 'PORSCHE-TAYCAN-001' },
        update: {},
        create: {
            vin: 'PORSCHE-TAYCAN-001',
            name: 'Dream Car',
            model: 'Taycan',
            year: 2024,
        },
    });

    const vehicle3 = await prisma.vehicle.upsert({
        where: { vin: 'IONIQ-5-001' },
        update: {},
        create: {
            vin: 'IONIQ-5-001',
            name: 'Daily Driver',
            model: 'Ioniq 5',
            year: 2024,
        },
    });

    console.log({ vehicle1, vehicle2, vehicle3 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

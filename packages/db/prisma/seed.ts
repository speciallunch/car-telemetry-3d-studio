import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // User 1명
  await prisma.user.upsert({
    where: { email: "demo@local.dev" },
    create: { email: "demo@local.dev", name: "Demo User" },
    update: { name: "Demo User" },
  });

  // Vehicle 2대
  const v1 = await prisma.vehicle.upsert({
    where: { vin: "VIN-DEMO-0001" },
    create: {
      vin: "VIN-DEMO-0001",
      name: "Demo Car 1",
      model: "Sedan X",
      year: 2022,
    },
    update: { name: "Demo Car 1", model: "Sedan X", year: 2022 },
  });

  const v2 = await prisma.vehicle.upsert({
    where: { vin: "VIN-DEMO-0002" },
    create: {
      vin: "VIN-DEMO-0002",
      name: "Demo Car 2",
      model: "SUV Y",
      year: 2023,
    },
    update: { name: "Demo Car 2", model: "SUV Y", year: 2023 },
  });

  // Telemetry 샘플(각 차량 10개씩)
  const now = Date.now();
  const points = Array.from({ length: 10 }).map((_, i) => ({
    speed: 20 + i * 3,
    battery: 12.6 - i * 0.03,
    latitude: 37.5 + i * 0.0001,
    longitude: 127.035 + i * 0.0001,
    timestamp: new Date(now - (10 - i) * 1000), // 1초 간격
  }));

  await prisma.telemetry.createMany({
    data: points.map((p) => ({ vehicleId: v1.id, ...p })),
    skipDuplicates: true,
  });

  await prisma.telemetry.createMany({
    data: points.map((p) => ({ vehicleId: v2.id, ...p })),
    skipDuplicates: true,
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import { CAMBODIA_FACILITIES } from '../src/lib/data/facilities';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Cambodian healthcare facilities into PostgreSQL database...');

  for (const fac of CAMBODIA_FACILITIES) {
    await prisma.healthcareFacility.upsert({
      where: { id: fac.id },
      update: {
        nameKm: fac.name_km,
        nameEn: fac.name_en,
        type: fac.type,
        province: fac.province,
        district: fac.district,
        addressKm: fac.address_km,
        addressEn: fac.address_en,
        latitude: fac.latitude,
        longitude: fac.longitude,
        phone: fac.phone,
        emergencyPhone: fac.emergency_phone || null,
        openingHours: fac.opening_hours,
        emergencyAvailable: fac.emergency_available,
        services: fac.services
      },
      create: {
        id: fac.id,
        nameKm: fac.name_km,
        nameEn: fac.name_en,
        type: fac.type,
        province: fac.province,
        district: fac.district,
        addressKm: fac.address_km,
        addressEn: fac.address_en,
        latitude: fac.latitude,
        longitude: fac.longitude,
        phone: fac.phone,
        emergencyPhone: fac.emergency_phone || null,
        openingHours: fac.opening_hours,
        emergencyAvailable: fac.emergency_available,
        services: fac.services
      }
    });
  }

  console.log('Successfully seeded Cambodian healthcare facilities!');
}

main()
  .catch((e) => {
    console.error('Prisma seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

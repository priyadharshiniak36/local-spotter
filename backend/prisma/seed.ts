import { PrismaClient, UserRole, UserStatus, BusinessStatus, SubscriptionPlanSlug, SubscriptionStatus, OrderStatus, ReviewStatus, WorkshopStatus, RouteStatus, PayoutStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting LocalSpotter database seed...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Subscription Plans
  console.log('📌 Seeding Subscription Plans...');
  const webshopPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: SubscriptionPlanSlug.WEBSHOP },
    update: {},
    create: {
      name: 'Webshop',
      slug: SubscriptionPlanSlug.WEBSHOP,
      description: 'Online winkelprofiel, productcatalogus, voorraadbeheer en directe verkoop.',
      monthlyPrice: 50.0,
      currency: 'EUR',
      active: true,
    },
  });

  const shoproutesPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: SubscriptionPlanSlug.SHOPROUTES },
    update: {},
    create: {
      name: 'Shoproutes',
      slug: SubscriptionPlanSlug.SHOPROUTES,
      description: 'Alle Webshop functies + GPS kaartweergave, winkelroutes en lokale ontdekking.',
      monthlyPrice: 100.0,
      currency: 'EUR',
      active: true,
    },
  });

  const workshopPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: SubscriptionPlanSlug.WORKSHOP },
    update: {},
    create: {
      name: 'Workshop',
      slug: SubscriptionPlanSlug.WORKSHOP,
      description: 'Alle Webshop & Shoproutes functies + workshop organisatie, reviews & community.',
      monthlyPrice: 150.0,
      currency: 'EUR',
      active: true,
    },
  });

  // 2. Create Super Admin User
  console.log('👤 Seeding Super Admin User...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@localspotter.nl' },
    update: {},
    create: {
      email: 'admin@localspotter.nl',
      mobile: '+31612345678',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  // 3. Create Business Owner 1 & Profile
  console.log('🏬 Seeding Business Owner 1 & Profile...');
  const ownerUser1 = await prisma.user.upsert({
    where: { email: 'eigenaar@boetiek-amsterdam.nl' },
    update: {},
    create: {
      email: 'eigenaar@boetiek-amsterdam.nl',
      mobile: '+31623456789',
      passwordHash,
      role: UserRole.BUSINESS_OWNER,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
      businessOwnerProfile: {
        create: {
          displayName: 'Anouk van Dijk',
          phone: '020-1234567',
        },
      },
    },
    include: { businessOwnerProfile: true },
  });

  // 4. Create Business Category
  const fashionCategory = await prisma.businessCategory.upsert({
    where: { slug: 'fashion-kleding' },
    update: {},
    create: {
      name: 'Fashion & Kleding',
      slug: 'fashion-kleding',
      description: 'Lokale kledingboetieks, schoenen en accessoires.',
    },
  });

  const homeCategory = await prisma.businessCategory.upsert({
    where: { slug: 'home-living' },
    update: {},
    create: {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Interieur, meubels en decoratie van lokale makers.',
    },
  });

  // 5. Create Business 1
  console.log('🏪 Seeding Business 1 (Boetiek Amsterdam)...');
  const business1 = await prisma.business.upsert({
    where: { slug: 'boetiek-amsterdam' },
    update: {},
    create: {
      ownerProfileId: ownerUser1.businessOwnerProfile!.id,
      name: 'Boetiek Amsterdam',
      slug: 'boetiek-amsterdam',
      description: 'Duurzame mode en ambachtelijke accessoires in het hart van Amsterdam.',
      phone: '020-1234567',
      email: 'info@boetiek-amsterdam.nl',
      kvkNumber: '87654321',
      categoryId: fashionCategory.id,
      state: 'Noord-Holland',
      city: 'Amsterdam',
      street: 'Keizersgracht',
      houseNumber: '142',
      postalCode: '1015 CX',
      latitude: 52.3752,
      longitude: 4.8851,
      status: BusinessStatus.ACTIVE,
      averageRating: 4.8,
      ratingCount: 12,
      followerCount: 145,
      subscription: {
        create: {
          planId: workshopPlan.id,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
      hours: {
        createMany: {
          data: [
            { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00', isClosed: false },
            { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00', isClosed: false },
            { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00', isClosed: false },
            { dayOfWeek: 4, openTime: '09:00', closeTime: '20:00', isClosed: false },
            { dayOfWeek: 5, openTime: '09:00', closeTime: '18:00', isClosed: false },
            { dayOfWeek: 6, openTime: '10:00', closeTime: '17:00', isClosed: false },
            { dayOfWeek: 0, openTime: null, closeTime: null, isClosed: true },
          ],
        },
      },
    },
  });

  // 6. Create Product Category & Products
  console.log('📦 Seeding Products...');
  const prodCategoryClothing = await prisma.productCategory.upsert({
    where: { slug: 'kleding' },
    update: {},
    create: { name: 'Kleding', slug: 'kleding' },
  });

  const product1 = await prisma.product.create({
    data: {
      businessId: business1.id,
      categoryId: prodCategoryClothing.id,
      name: 'Handgemaakte Leren Shopper',
      slug: 'handgemaakte-leren-shopper',
      description: 'Stijlvolle en duurzame tas gemaakt van 100% plantaardig looien leer.',
      price: 149.95,
      stock: 15,
      active: true,
      variants: {
        createMany: {
          data: [
            { color: 'Zwart', sku: 'SHOPPER-BLK', price: 149.95, stock: 8 },
            { color: 'Bruin', sku: 'SHOPPER-BRN', price: 149.95, stock: 7 },
          ],
        },
      },
    },
  });

  // 7. Create Consumer User & Profile
  console.log('🛍️ Seeding Consumer User...');
  const consumerUser = await prisma.user.upsert({
    where: { email: 'sophie.vis@example.nl' },
    update: {},
    create: {
      email: 'sophie.vis@example.nl',
      mobile: '+31634567890',
      passwordHash,
      role: UserRole.CONSUMER,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
      consumerProfile: {
        create: {
          displayName: 'Sophie Vis',
          firstName: 'Sophie',
          lastName: 'Vis',
          phone: '06-34567890',
        },
      },
    },
    include: { consumerProfile: true },
  });

  // 8. Create Workshop
  console.log('🎨 Seeding Workshop...');
  await prisma.workshop.create({
    data: {
      businessId: business1.id,
      title: 'Ambachtelijk Leerbewerken Workshop',
      slug: 'ambachtelijk-leerbewerken-workshop',
      description: 'Leer de basistechnieken van ambachtelijk leer snijden, stikken en afwerken.',
      price: 65.00,
      capacity: 10,
      bookedCount: 3,
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      location: 'Keizersgracht 142, Amsterdam',
      latitude: 52.3752,
      longitude: 4.8851,
      status: WorkshopStatus.PUBLISHED,
    },
  });

  // 9. Create Shop Route
  console.log('🗺️ Seeding Shop Route...');
  await prisma.shopRoute.create({
    data: {
      businessId: business1.id,
      title: 'Jordaan Ambacht & Design Route',
      slug: 'jordaan-ambacht-design-route',
      description: 'Wandel langs de leukste ambachtelijke boetieks en ateliers in de Jordaan.',
      city: 'Amsterdam',
      status: RouteStatus.PUBLISHED,
      stops: {
        create: [
          { businessId: business1.id, title: 'Boetiek Amsterdam', description: 'Startpunt met koffie en ambachtelijk leer', sequence: 1, latitude: 52.3752, longitude: 4.8851 },
          { businessId: business1.id, title: 'Atelier de Herengracht', description: 'Keramiek en handgemaakt servies', sequence: 2, latitude: 52.3735, longitude: 4.8870 },
        ],
      },
    },
  });

  // 10. Create Review
  console.log('⭐ Seeding Review...');
  await prisma.review.create({
    data: {
      businessId: business1.id,
      consumerProfileId: consumerUser.consumerProfile!.id,
      productId: product1.id,
      rating: 5,
      title: 'Prachtige kwaliteit tas!',
      comment: 'Super snelle verzending en het leer is ontzettend mooi afgewerkt.',
      status: ReviewStatus.PUBLISHED,
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

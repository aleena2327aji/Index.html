import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: { email: 'seller@example.com', role: 'SELLER', name: 'Green Valley Farms' }
  });

  const seller = await prisma.sellerProfile.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: { userId: sellerUser.id, storeName: 'Green Valley Farms', city: 'Madison', state: 'WI' }
  });

  // Print SELLER_ID for frontend usage
  console.log('SELLER_ID', seller.id);

  const products = await Promise.all([
    prisma.product.create({ data: { sellerId: seller.id, name: 'Heirloom Tomatoes', description: 'Juicy and sweet.', category: 'VEGETABLES', priceCents: 499, unit: 'lb', inventory: 50, images: { create: [{ url: 'https://picsum.photos/seed/tomato/800/600' }] } } }),
    prisma.product.create({ data: { sellerId: seller.id, name: 'Sourdough Bread', description: 'Artisan loaf.', category: 'BAKED_GOODS', isValueAdded: true, priceCents: 699, unit: 'loaf', inventory: 20, images: { create: [{ url: 'https://picsum.photos/seed/bread/800/600' }] } } })
  ]);

  const session = await prisma.session.create({ data: { sellerId: seller.id, city: 'Madison', region: 'WI', userAgent: 'seed', ip: '127.0.0.1' } });

  await prisma.pageView.createMany({ data: [
    { sessionId: session.id, sellerId: seller.id, productId: products[0].id, path: `/products/${products[0].id}` },
    { sessionId: session.id, sellerId: seller.id, productId: products[1].id, path: `/products/${products[1].id}` },
  ]});

  const order = await prisma.order.create({ data: {
    sellerId: seller.id,
    totalAmountCents: 1198,
    status: 'COMPLETED',
    items: { create: [
      { productId: products[0].id, quantity: 1, unitPriceCents: 499 },
      { productId: products[1].id, quantity: 1, unitPriceCents: 699 },
    ]}
  }});

  console.log({ seller: seller.storeName, products: products.length, order: order.id });
}

main().finally(async () => {
  await prisma.$disconnect();
});

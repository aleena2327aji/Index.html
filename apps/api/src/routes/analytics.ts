import { Router } from 'express';
import { subDays, startOfDay } from 'date-fns';
import { prisma } from '../lib/prisma.js';

export const analyticsRouter = Router();

analyticsRouter.get('/overview', async (req, res) => {
  const { sellerId, days = '30' } = req.query as { sellerId?: string; days?: string };
  if (!sellerId) return res.status(400).json({ error: 'sellerId required' });
  const daysNum = parseInt(days, 10);
  const since = subDays(new Date(), daysNum);

  const [views, uniqueSessions, ordersCount, revenue, addToCarts, pageViewsTotal, sessionsTotal] = await Promise.all([
    prisma.pageView.count({ where: { sellerId, createdAt: { gte: since } } }),
    prisma.session.count({ where: { sellerId, createdAt: { gte: since } } }),
    prisma.order.count({ where: { sellerId, createdAt: { gte: since } } }),
    prisma.order.aggregate({ _sum: { totalAmountCents: true }, where: { sellerId, createdAt: { gte: since } } }),
    prisma.addToCartEvent.count({ where: { sellerId, createdAt: { gte: since } } }),
    prisma.pageView.count({ where: { sellerId } }),
    prisma.session.count({ where: { sellerId } })
  ]);

  const conversionRate = uniqueSessions > 0 ? ordersCount / uniqueSessions : 0;
  const viewToCartRate = views > 0 ? addToCarts / views : 0;
  const sessionsWithCounts = await prisma.session.findMany({
    where: { sellerId, createdAt: { gte: since } },
    select: { id: true, _count: { select: { pageViews: true } } }
  });
  const bounced = sessionsWithCounts.filter(s => s._count.pageViews <= 1).length;
  const revenueCents = revenue._sum.totalAmountCents ?? 0;
  const avgOrderValueCents = ordersCount > 0 ? Math.round(revenueCents / ordersCount) : 0;

  res.json({
    since,
    totalPageViews: views,
    uniqueVisitors: uniqueSessions,
    orders: ordersCount,
    revenueCents,
    avgOrderValueCents,
    conversionRate,
    viewToCartRate,
    bounceRate: sessionsTotal > 0 ? bounced / sessionsTotal : 0,
    lifetime: {
      pageViews: pageViewsTotal,
      sessions: sessionsTotal
    }
  });
});

analyticsRouter.get('/sales-by-interval', async (req, res) => {
  const { sellerId, days = '30' } = req.query as { sellerId?: string; days?: string };
  if (!sellerId) return res.status(400).json({ error: 'sellerId required' });
  const daysNum = parseInt(days, 10);
  const since = subDays(new Date(), daysNum);

  const orders = await prisma.order.findMany({
    where: { sellerId, createdAt: { gte: since } },
    select: { createdAt: true, totalAmountCents: true }
  });

  const byDay = new Map<string, number>();
  for (const o of orders) {
    const key = startOfDay(o.createdAt).toISOString();
    byDay.set(key, (byDay.get(key) ?? 0) + o.totalAmountCents);
  }

  res.json(Array.from(byDay.entries()).map(([day, cents]) => ({ day, cents })));
});

analyticsRouter.get('/top-products', async (req, res) => {
  const { sellerId, limit = '5' } = req.query as { sellerId?: string; limit?: string };
  if (!sellerId) return res.status(400).json({ error: 'sellerId required' });
  const lim = parseInt(limit, 10);

  const items = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
    where: { order: { sellerId } },
    orderBy: { _sum: { quantity: 'desc' } },
    take: lim
  });

  const products = await prisma.product.findMany({
    where: { id: { in: items.map(i => i.productId) } },
    select: { id: true, name: true, isValueAdded: true }
  });

  const result = items.map(i => ({
    productId: i.productId,
    quantity: i._sum.quantity ?? 0,
    product: products.find(p => p.id === i.productId)
  }));

  res.json(result);
});

analyticsRouter.get('/visitors-geo', async (req, res) => {
  const { sellerId, days = '30' } = req.query as { sellerId?: string; days?: string };
  if (!sellerId) return res.status(400).json({ error: 'sellerId required' });
  const daysNum = parseInt(days, 10);
  const since = subDays(new Date(), daysNum);

  const sessions = await prisma.session.findMany({
    where: { sellerId, createdAt: { gte: since } },
    select: { city: true, region: true }
  });
  const counts = new Map<string, number>();
  for (const s of sessions) {
    const key = `${s.city ?? 'Unknown'}, ${s.region ?? ''}`.trim();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const result = Array.from(counts.entries())
    .map(([place, count]) => ({ place, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  res.json(result);
});

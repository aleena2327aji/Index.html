import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const trackRouter = Router();

trackRouter.post('/session', async (req, res) => {
  const { sellerId, userId, ip, userAgent, city, region } = req.body as any;
  const session = await prisma.session.create({ data: { sellerId, userId, ip, userAgent, city, region } });
  res.json(session);
});

trackRouter.post('/pageview', async (req, res) => {
  const { sessionId, sellerId, productId, path } = req.body as any;
  const pv = await prisma.pageView.create({ data: { sessionId, sellerId, productId, path } });
  res.json(pv);
});

trackRouter.post('/add-to-cart', async (req, res) => {
  const { sessionId, sellerId, productId } = req.body as any;
  const e = await prisma.addToCartEvent.create({ data: { sessionId, sellerId, productId } });
  res.json(e);
});

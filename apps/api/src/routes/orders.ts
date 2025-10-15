import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const ordersRouter = Router();

ordersRouter.get('/', async (req, res) => {
  const { sellerId, status } = req.query as { sellerId?: string; status?: string };
  const where: any = {};
  if (sellerId) where.sellerId = sellerId;
  if (status) where.status = status as any;
  const orders = await prisma.order.findMany({
    where,
    include: { items: { include: { product: true } } }
  });
  res.json(orders);
});

ordersRouter.post('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body as { status: string };
  const order = await prisma.order.update({ where: { id }, data: { status: status as any } });
  res.json(order);
});

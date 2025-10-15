import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
  const { sellerId } = req.query as { sellerId?: string };
  const where = sellerId ? { sellerId } : {};
  const products = await prisma.product.findMany({
    where,
    include: { images: true }
  });
  res.json(products);
});

const upsertSchema = z.object({
  id: z.string().optional(),
  sellerId: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string(),
  isValueAdded: z.boolean().optional().default(false),
  priceCents: z.number().int().min(0),
  unit: z.string().min(1),
  inventory: z.number().int().min(0),
  images: z.array(z.string().url()).default([])
});

productsRouter.post('/upsert', async (req, res) => {
  const parsed = upsertSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { id, images, ...data } = parsed.data;

  const product = await prisma.product.upsert({
    where: { id: id ?? '' },
    create: {
      ...data,
      images: { create: images.map((url) => ({ url })) }
    },
    update: {
      ...data,
      images: { deleteMany: {}, create: images.map((url) => ({ url })) }
    }
  });
  res.json(product);
});

productsRouter.post('/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { inventory } = req.body as { inventory: number };
  const product = await prisma.product.update({ where: { id }, data: { inventory } });
  res.json(product);
});

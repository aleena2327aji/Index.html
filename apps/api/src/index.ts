import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json } from 'express';

import { productsRouter } from './routes/products.js';
import { ordersRouter } from './routes/orders.js';
import { analyticsRouter } from './routes/analytics.js';
import { trackRouter } from './routes/track.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: '*'}));
app.use(morgan('dev'));
app.use(json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, name: 'Farm-to-Table Direct API' });
});

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/track', trackRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});

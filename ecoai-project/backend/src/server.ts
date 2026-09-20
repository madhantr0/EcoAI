import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, allowedOrigins } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

import authRoutes from './routes/auth.routes.js';
import zonesRoutes from './routes/zones.routes.js';
import postsRoutes from './routes/posts.routes.js';
import verifyRoutes from './routes/verify.routes.js';
import satelliteRoutes from './routes/satellite.routes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origin not allowed: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
app.use('/api', apiLimiter);

app.get('/health', (_req, res) => res.json({ ok: true, service: 'ecoai-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/satellite', satelliteRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`EcoAI backend listening on http://localhost:${env.PORT}`);
});

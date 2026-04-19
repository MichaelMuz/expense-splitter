import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// future: express-prom-bundle for /metrics endpoint (request duration, status codes, in-flight counts)
router.get('/healthz', (_req, res) => res.send('ok'));
router.get('/readyz', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.send('ok');
  } catch {
    res.status(503).send('db unreachable');
  }
});

export default router;

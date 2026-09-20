import { Router } from 'express';
import * as ctrl from '../controllers/zones.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.get('/', ctrl.listZones);
r.get('/:id', ctrl.getZone);
r.post('/adopt', requireAuth, ctrl.adoptZone);
export default r;

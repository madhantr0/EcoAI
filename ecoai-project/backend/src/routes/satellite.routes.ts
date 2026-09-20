import { Router } from 'express';
import * as ctrl from '../controllers/satellite.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.post('/preview', requireAuth, ctrl.previewConfidence);
r.post('/zones', requireAuth, ctrl.createZoneFromSatellite);
export default r;

import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.post('/signup', ctrl.signup);
r.post('/login', ctrl.login);
r.get('/me', requireAuth, ctrl.me);
export default r;

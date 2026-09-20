import { Router } from 'express';
import * as ctrl from '../controllers/posts.controller.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.get('/', ctrl.listPosts);
r.get('/me/chain', requireAuth, ctrl.myChain);
r.get('/:id', ctrl.getPost);
export default r;

import { Router } from 'express';
import multer from 'multer';
import * as ctrl from '../controllers/verify.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { verifyLimiter } from '../middleware/rateLimit.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpe?g|png|webp|heic)$/i.test(file.mimetype);
    cb(ok ? null : new Error('Only image uploads allowed'), ok);
  },
});

const r = Router();
r.post('/submit', requireAuth, verifyLimiter, upload.single('photo'), ctrl.submitVerification);
r.get('/integrity', requireAuth, ctrl.checkIntegrity);
export default r;

import type { NextFunction, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export interface AuthedRequest extends Request {
  user?: { id: string; email?: string };
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: 'Invalid token' });

    req.user = { id: data.user.id, email: data.user.email ?? undefined };
    next();
  } catch (err) {
    next(err);
  }
}

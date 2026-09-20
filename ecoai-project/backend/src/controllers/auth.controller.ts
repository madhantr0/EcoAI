import type { Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import type { AuthedRequest } from '../middleware/auth.js';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(30),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signup(req: AuthedRequest, res: Response) {
  const body = signupSchema.parse(req.body);
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
  });
  if (error || !data.user) return res.status(400).json({ error: error?.message ?? 'Signup failed' });

  const { error: profileErr } = await supabaseAdmin
    .from('profiles')
    .insert({ id: data.user.id, username: body.username });
  if (profileErr) return res.status(500).json({ error: profileErr.message });

  return res.status(201).json({ user: { id: data.user.id, email: data.user.email } });
}

export async function login(req: AuthedRequest, res: Response) {
  const body = loginSchema.parse(req.body);
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });
  if (error || !data.session) return res.status(401).json({ error: error?.message ?? 'Invalid credentials' });

  return res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
  });
}

export async function me(req: AuthedRequest, res: Response) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', req.user!.id)
    .single();
  if (error) return res.status(404).json({ error: 'Profile not found' });
  return res.json({ profile: data });
}

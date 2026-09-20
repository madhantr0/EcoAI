'use client';

export interface StoredSession {
  access_token: string;
  refresh_token?: string;
}

export function setSession(session: StoredSession) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ecoai_token', session.access_token);
  if (session.refresh_token) localStorage.setItem('ecoai_refresh', session.refresh_token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ecoai_token');
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ecoai_token');
  localStorage.removeItem('ecoai_refresh');
}

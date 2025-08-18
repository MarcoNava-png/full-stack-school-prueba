'use client';

import { apiFetch } from "@/lib/fetcher";

type ApiResponse<T> = { data: T; isSuccess: boolean; messageError?: string | null };
type LoginData = {
  userId: string;
  email: string;
  role: string;
  token: string;
  expiration: string;
};

export async function login(email: string, password: string) {
  const res = await apiFetch<ApiResponse<LoginData>>(`/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.isSuccess) throw new Error(`Login failed: ${res.messageError}`);
  const u = res.data;

  localStorage.setItem('token', u.token);
  localStorage.setItem('usuario', JSON.stringify({ userId: u.userId, email: u.email, role: u.role }));
  return u;
}

function decode<T = any>(jwt: string): T | null {
  try { return JSON.parse(atob(jwt.split('.')[1])); } catch { return null; }
}

export async function validateSession(): Promise<any | null> {
  const token = localStorage.getItem('token') ?? '';
  if (!token) return null;

  const payload = decode<any>(token);
  if (!payload) return null;

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    return null;
  }

  const u = localStorage.getItem('usuario');
  if (u) return JSON.parse(u);

  return {
    userId: payload.userId,
    role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
  };
}

export async function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

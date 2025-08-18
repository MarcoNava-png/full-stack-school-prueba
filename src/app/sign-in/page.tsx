"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from "@/components/LoginForm";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function LoginPage() {
  const router: AppRouterInstance = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return <LoginForm />;
}

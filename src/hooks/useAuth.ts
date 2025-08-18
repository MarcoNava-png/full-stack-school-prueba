"use client";

import { useEffect, useState } from "react";
import { validateSession, logout } from "@/services/authService";
import { useRouter } from "next/navigation";

export function useAuth(redirectIfNoUser: boolean = false) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await validateSession();

        if (session) {
          setUser(session);
        } else {
          setUser(null);
          if (redirectIfNoUser) {
            router.push("/sign-in");
          }
        }
      } catch (err) {
        setUser(null);
        if (redirectIfNoUser) {
          router.push("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [redirectIfNoUser, router]);

  async function handleLogout() {
    await logout();
    setUser(null);
    router.push("/sign-in");
  }

  return { user, loading, handleLogout };
}

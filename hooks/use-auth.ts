"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthGuardResult {
  user: User | null;
  role: string | null;
  loading: boolean;
}

export function useAuthGuard(): AuthGuardResult {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.replace("/a/login"); // redirect if not logged in
        if (mounted) {
          setUser(null);
          setRole(null);
          setLoading(false);
        }
      } else if (mounted) {
        setUser(firebaseUser);

        try {
          // Force refresh token to get latest custom claims
          const idTokenResult = await getIdTokenResult(firebaseUser, true);
          const userRole = idTokenResult.claims.role as string | undefined;

          if (!userRole) router.replace("/a/login"); // redirect if not logged in
          setRole(userRole || null);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setRole(null);
          router.replace("/a/login"); // redirect if not logged in
        }

        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [router]);

  return { user, role, loading };
}

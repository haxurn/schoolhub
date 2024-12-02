"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginCredentials, LoginResponse } from "@/types/auth";
import { loginAdmin } from "@/lib/api/auth";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await loginAdmin(credentials);
      
      // Store the token in localStorage or a secure cookie
      localStorage.setItem("token", response.token);
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    error,
    loading,
  };
}
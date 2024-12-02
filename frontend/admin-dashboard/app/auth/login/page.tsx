"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BackgroundManager } from "@/components/backgrounds/BackgroundManager";

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-4">
      <BackgroundManager />
      <ThemeToggle />
      <LoginForm />
    </main>
  );
}
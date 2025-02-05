"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ModeToggle } from "@/components/mode-toggle";
import axiosInstance from "@/utils/axiosInstance";
import { toastSuccess, toastWarning, toastError } from "@/utils/toastOptions";
import PasswordStrengthMeter from "../_components/password-strength";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (!tokenParam) {
      router.push('/password-reset-request');
    } else {
      setToken(tokenParam);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toastError("Passwords do not match",);
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        token,
        newPassword: password,
      });

      if (response.status === 200) {
        toastSuccess("Password reset successful!", {
          ...toastSuccess,
          }
        );
        router.push('/login');
      } else {
        toastWarning(response.data.message || "Invalid or expired token");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toastError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <BackgroundBeams />

      <Card className="w-full max-w-md shadow-lg rounded-lg border-0 relative z-10">
        <CardContent className="p-8">
          <ModeToggle />
          <motion.h1
            className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Reset Password
          </motion.h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">New Password</label>
              <Input
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
              />
            </div>

            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: loading ? 0.95 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Button type="submit" className="w-full h-11 bg-[#6C63FF] hover:bg-[#5a52ff] text-white rounded-lg mt-4 flex items-center justify-center space-x-2" disabled={loading}>
                {loading ? (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <span>Loading...</span>
                  </motion.div>
                ) : (
                  <span>Reset Password</span>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
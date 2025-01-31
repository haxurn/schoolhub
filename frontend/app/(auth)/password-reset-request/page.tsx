"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ModeToggle } from "@/components/mode-toggle";
import { toastSuccess, toastWarning, toastError } from "@/utils/toastOptions";
import axiosInstance from "@/utils/axiosInstance";

export default function PasswordResetRequest() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/password-reset-request', {
        email,
      });

      if (response.status === 200) {
        toastSuccess("Password reset link sent to your email.", {
        });
      } else {
        // Correct usage of toast.error
        toastWarning(response.data.message || "Validation error."); // Removed toastWarning
      }
    } catch (error) {
      console.error("Password reset request error:", error);
      toastError("An error occurred. Please try again."); // Use toast.error directly
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
            Reset Your Password
          </motion.h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  <span>Request Password Reset</span>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
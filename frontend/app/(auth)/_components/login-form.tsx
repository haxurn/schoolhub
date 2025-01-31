"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ModeToggle } from "@/components/mode-toggle";
import { toastSuccess, toastWarning, toastError } from "@/utils/toastOptions";
import axiosInstance from "@/utils/axiosInstance";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', {    
        username,
        password,
      });

      const data = response.data;

      if (response.status === 200) {
        // Handle successful login
        toastSuccess("Login successful!");

        // Store token and user information
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Store credentials if "Remember Me" is checked
        if (rememberMe) {
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }

        // Redirect to dashboard or another page
        router.push('/dashboard'); // Adjust the route as necessary
      } else {
        // Handle login error
        toastWarning(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toastError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/password-reset-request');
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
            Sign in to Dashboard
          </motion.h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Username</label>
              <Input
                type="text"
                placeholder="Your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark :text-gray-400">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-lg border-gray-300 dark:border-gray-700 pr-10 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe((e.target as HTMLInputElement).checked)}
                  className="h-4 w-4 border-gray-300 dark:border-gray-700 rounded checked:bg-[#6C63FF] checked:border-[#6C63FF]"
                />
                <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
                  Remember Me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-[#6C63FF] hover:text-[#5a52ff]"
              >
                Forgot Password?
              </button>
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
                    <LogIn className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
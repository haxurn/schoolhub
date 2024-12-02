"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoginFormInputs } from "./LoginFormInputs";
import { LoginFormHeader } from "./LoginFormHeader";
import { LoginFormFooter } from "./LoginFormFooter";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LoginFormData } from "@/types/auth";

export function LoginForm() {
  const { login, error, loading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (data: LoginFormData) => {
    await login({
      username: data.username,
      password: data.password,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-8 bg-background/95 backdrop-blur-md shadow-xl border-t border-background/10 hover:shadow-glow focus:shadow-glow transition-all duration-300">
      <LoginFormHeader />
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }} className="space-y-6">
        <LoginFormInputs
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}  // Passing the correct onSubmit handler
        />
        <Button 
          type="submit" 
          className="w-full text-base py-6" 
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <LoginFormFooter />
    </Card>
  );
}

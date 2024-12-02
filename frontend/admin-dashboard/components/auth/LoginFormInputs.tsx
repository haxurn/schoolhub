import React, { useState, useEffect } from 'react'; // Import React and hooks
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { LoginFormData } from "@/types/auth";

// Create a Zod schema for validating the login form data
const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type LoginFormInputsProps = {
  formData: LoginFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: LoginFormData) => void;
};

export function LoginFormInputs({ formData, onChange, onSubmit }: LoginFormInputsProps) {
  const [errors, setErrors] = useState<{ username?: string; password?: string; rememberMe?: string }>({});
  const [isMounted, setIsMounted] = useState(false); // Track mounting status to avoid hydration mismatch

  // Wait for the component to be mounted before rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Ensure the form is not rendered until after the component is mounted
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({}); // Reset errors before validating

    try {
      loginFormSchema.parse(formData); 
      onSubmit(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          errorMessages[err.path[0]] = err.message;
        });
        setErrors(errorMessages); // Store validation errors
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2 text-glow">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={onChange}
          placeholder="Enter your username"
          required
          className="bg-background/80 text-glow"
        />
        {errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}
      </div>

      <div className="space-y-2 text-glow">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={onChange}
          placeholder="Enter your password"
          required
          className="bg-background/100 text-glow"
        />
        {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="rememberMe"
          name="rememberMe"
          checked={formData.rememberMe}
          onCheckedChange={(checked) =>
            onChange({
              target: {
                name: "rememberMe",
                type: "checkbox",
                checked: checked as boolean,
              },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />
        <Label htmlFor="rememberMe" className="text-sm">
          Remember me
        </Label>
        {errors.rememberMe && <div className="text-red-500 text-sm">{errors.rememberMe}</div>}
      </div>

  
    </form>
  );
}

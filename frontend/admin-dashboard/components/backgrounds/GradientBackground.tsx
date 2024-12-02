"use client";

import { useTheme } from "next-themes";

export function GradientBackground() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 -z-10">
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: theme === "dark" ? 1 : 0,
          background: `
            radial-gradient(circle at 50% 0%, #1a237e 0%, transparent 50%),
            radial-gradient(circle at 100% 50%, #311b92 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, #0d47a1 0%, transparent 50%),
            radial-gradient(circle at 0% 50%, #1a237e 0%, #000000 100%)
          `
        }}
      />
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: theme === "light" ? 1 : 0,
          background: `
            radial-gradient(circle at 50% 0%, #e3f2fd 0%, transparent 50%),
            radial-gradient(circle at 100% 50%, #bbdefb 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, #e8eaf6 0%, transparent 50%),
            radial-gradient(circle at 0% 50%, #e3f2fd 0%, #ffffff 100%)
          `
        }}
      />
      <div 
        className="absolute inset-0 bg-repeat opacity-5 icon-glow"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px"
        }}
      />
    </div>
  );
}
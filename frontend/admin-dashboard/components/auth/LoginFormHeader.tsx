import { School } from "lucide-react";

export function LoginFormHeader() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <School className="h-6 w-6 text-primary icon-glow" />
      <h1 className="text-2xl font-bold text-primary text-glow">SchoolHub Admin</h1>
    </div>
  );
}
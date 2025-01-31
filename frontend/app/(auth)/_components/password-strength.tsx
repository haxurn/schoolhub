"use client";

import React from "react";
import zxcvbn from "zxcvbn";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { score } = zxcvbn(password);

  const getPasswordStrengthColor = (score: number) => {
    switch (score) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div>
      <div className="h-2 w-full bg-gray-300 rounded">
        <div
          className={`h-full rounded ${getPasswordStrengthColor(score)}`}
          style={{ width: `${(score + 1) * 20}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Password strength: {["Very Weak", "Weak", "Fair", "Good", "Strong"][score]}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
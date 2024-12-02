import React, { useEffect, useState } from "react";

type NotificationProps = {
  message: string;
  type?: "success" | "error";
  duration?: number; // Duration in milliseconds
  onClose?: () => void; // Callback when notification closes
};

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = "success",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-md text-white ${bgColor}`}
    >
      {message}
    </div>
  );
};

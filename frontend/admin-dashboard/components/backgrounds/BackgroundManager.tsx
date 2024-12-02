"use client";

import { useTheme } from "next-themes";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DarkBackground = dynamic(() => import('./DarkBackground'), {
  ssr: false,
});

const LightBackground = dynamic(() => import('./LightBackground'), {
  ssr: false,
});

export function BackgroundManager() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return theme === "dark" ? <DarkBackground /> : <LightBackground />;
}
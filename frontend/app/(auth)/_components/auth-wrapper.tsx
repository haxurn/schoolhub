"use client";

import React from "react";
import withAuth from "@/utils/withAuth";

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default withAuth(AuthWrapper);
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  exp: number;
  iat: number;
  [key: string]: unknown; // Add other fields as needed
}

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      const token = localStorage.getItem("token");
      const publicPaths = ['/', '/login', '/password-reset-request', '/reset-password']; // Add paths that do not require authentication
      const pathIsPublic = pathname ? publicPaths.includes(pathname) : false;

      if (token) {
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
        }
      }

      if (!token && !pathIsPublic) {
        router.push("/login");
      }
    }, [router, pathname]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
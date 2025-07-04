"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/components/store";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = "/auth",
}) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !isLoggedIn) {
      // User needs to be logged in but isn't
      router.push(redirectTo);
    } else if (!requireAuth && isLoggedIn) {
      // User is logged in but shouldn't access this page (e.g., auth page)
      router.push("/dashboard");
    }
  }, [isLoggedIn, requireAuth, redirectTo, router]);

  // Show loading while checking authentication
  if (requireAuth && !isLoggedIn) {
    return <LoadingSpinner />;
  }

  // Show loading while redirecting logged-in users away from auth pages
  if (!requireAuth && isLoggedIn) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

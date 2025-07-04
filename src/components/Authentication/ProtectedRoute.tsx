"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/components/store";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner";
import { selectIsCustomerExperienceEnabled } from "@/components/store/storeSettingsSlice";

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
  const allowGuestBrowsing = useSelector(
    selectIsCustomerExperienceEnabled("allowGuestBrowsing")
  );
  const router = useRouter();

  useEffect(() => {
    if ((requireAuth && !isLoggedIn) || (!allowGuestBrowsing && !isLoggedIn)) {
      // User needs to be logged in but isn't, or guest browsing is disabled
      router.push(redirectTo);
    } else if (!requireAuth && isLoggedIn) {
      // User is logged in but shouldn't access this page (e.g., auth page)
      router.push("/dashboard");
    }
  }, [isLoggedIn, requireAuth, redirectTo, router, allowGuestBrowsing]);

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

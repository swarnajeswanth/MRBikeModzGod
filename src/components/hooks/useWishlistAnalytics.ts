import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { selectIsCustomerExperienceEnabled } from "../store/storeSettingsSlice";

export const useWishlistAnalytics = () => {
  const { isLoggedIn, id: userId } = useSelector(
    (state: RootState) => state.user
  );
  const isAnalyticsEnabled = useSelector(
    selectIsCustomerExperienceEnabled("enableWishlistAnalytics")
  );

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Generate session ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Track customer login
  const trackLogin = useCallback(async () => {
    if (!isLoggedIn || !userId || !isAnalyticsEnabled) return;

    try {
      const token = getToken();
      if (!token) return;

      const sessionId = generateSessionId();

      await fetch("/api/admin/wishlist-analytics", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          sessionId,
        }),
      });
    } catch (error) {
      console.error("Error tracking login:", error);
    }
  }, [isLoggedIn, userId]);

  // Track wishlist action
  const trackWishlistAction = useCallback(
    async (
      action: "add_to_wishlist" | "remove_from_wishlist",
      productId: string,
      productName: string
    ) => {
      if (!isLoggedIn || !userId || !isAnalyticsEnabled) return;

      try {
        const token = getToken();
        if (!token) return;

        const sessionId = generateSessionId();

        await fetch("/api/admin/wishlist-analytics", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            productId,
            productName,
            sessionId,
          }),
        });
      } catch (error) {
        console.error("Error tracking wishlist action:", error);
      }
    },
    [isLoggedIn, userId]
  );

  // Track add to wishlist
  const trackAddToWishlist = useCallback(
    (productId: string, productName: string) => {
      trackWishlistAction("add_to_wishlist", productId, productName);
    },
    [trackWishlistAction]
  );

  // Track remove from wishlist
  const trackRemoveFromWishlist = useCallback(
    (productId: string, productName: string) => {
      trackWishlistAction("remove_from_wishlist", productId, productName);
    },
    [trackWishlistAction]
  );

  // Track login on component mount if user is logged in
  useEffect(() => {
    if (isLoggedIn && userId && isAnalyticsEnabled) {
      trackLogin();
    }
  }, [isLoggedIn, userId, isAnalyticsEnabled, trackLogin]);

  return {
    trackLogin,
    trackAddToWishlist,
    trackRemoveFromWishlist,
    trackWishlistAction,
  };
};

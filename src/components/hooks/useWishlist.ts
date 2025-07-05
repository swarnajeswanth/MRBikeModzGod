import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  toggleWishlist,
  syncWishlistWithBackend,
  loadWishlistFromBackend,
  WishlistItem,
} from "../store/UserSlice";
import { toast } from "react-hot-toast";

export const useWishlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wishlist, isLoggedIn } = useSelector(
    (state: RootState) => state.user
  );

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Load wishlist from backend
  const loadWishlist = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch("/api/user/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          dispatch(loadWishlistFromBackend(data.wishlist));
        }
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  }, [dispatch, isLoggedIn]);

  // Sync wishlist to backend
  const syncWishlist = useCallback(
    async (wishlistItems: WishlistItem[]) => {
      if (!isLoggedIn) return;

      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch("/api/user/wishlist", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wishlist: wishlistItems }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            console.log("Wishlist synced successfully");
          }
        }
      } catch (error) {
        console.error("Error syncing wishlist:", error);
      }
    },
    [isLoggedIn]
  );

  // Toggle wishlist item with backend sync
  const toggleWishlistItem = useCallback(
    async (item: WishlistItem) => {
      // Update local state immediately for better UX
      dispatch(toggleWishlist(item));

      // Check if item is now in wishlist
      const isInWishlist = wishlist.some(
        (wishlistItem) => wishlistItem.id === item.id
      );
      const newWishlistState = isInWishlist
        ? wishlist.filter((wishlistItem) => wishlistItem.id !== item.id)
        : [...wishlist, item];

      // Sync with backend
      await syncWishlist(newWishlistState);

      // Show toast message
      if (isInWishlist) {
        toast.success("Removed from wishlist");
      } else {
        toast.success("Added to wishlist");
      }
    },
    [dispatch, wishlist, syncWishlist]
  );

  // Check if item is in wishlist
  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => item.id === productId);
    },
    [wishlist]
  );

  // Get wishlist count
  const getWishlistCount = useCallback(() => {
    return wishlist.length;
  }, [wishlist]);

  return {
    wishlist,
    isInWishlist,
    toggleWishlistItem,
    loadWishlist,
    syncWishlist,
    getWishlistCount,
  };
};

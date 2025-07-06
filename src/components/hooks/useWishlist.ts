import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  toggleWishlist,
  syncWishlistWithBackend,
  loadWishlistFromBackend,
  WishlistItem,
} from "../store/UserSlice";
import { toast } from "react-hot-toast";
import { useWishlistAnalytics } from "./useWishlistAnalytics";

export const useWishlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { wishlist, isLoggedIn } = useSelector(
    (state: RootState) => state.user
  );
  const { trackAddToWishlist, trackRemoveFromWishlist } =
    useWishlistAnalytics();

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Populate wishlist items with product details
  const populateWishlistWithProductDetails = useCallback(() => {
    if (products.length === 0 || wishlist.length === 0) return;

    const populatedWishlist = wishlist.map((wishlistItem) => {
      const product = products.find((p) => p.id === wishlistItem.id);
      if (product) {
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          image:
            product.images && product.images.length > 0
              ? product.images[0]
              : "",
          category: product.category,
        };
      }
      return wishlistItem;
    });

    // Only update if there are changes
    const hasChanges = populatedWishlist.some((item, index) => {
      const original = wishlist[index];
      return item.name !== original.name || item.price !== original.price;
    });

    if (hasChanges) {
      dispatch(syncWishlistWithBackend(populatedWishlist));
    }
  }, [products, wishlist, dispatch]);

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
      // Check if item is currently in wishlist BEFORE updating state
      const isCurrentlyInWishlist = wishlist.some(
        (wishlistItem) => wishlistItem.id === item.id
      );

      // Update local state immediately for better UX
      dispatch(toggleWishlist(item));

      // Calculate new wishlist state based on the toggle action
      const newWishlistState = isCurrentlyInWishlist
        ? wishlist.filter((wishlistItem) => wishlistItem.id !== item.id)
        : [...wishlist, item];

      // Sync with backend
      await syncWishlist(newWishlistState);

      // Track analytics
      if (isInWishlist) {
        trackRemoveFromWishlist(item.id, item.name);
        toast.success("Removed from wishlist");
      } else {
        trackAddToWishlist(item.id, item.name);
        toast.success("Added to wishlist");
      }
    },
    [
      dispatch,
      wishlist,
      syncWishlist,
      trackAddToWishlist,
      trackRemoveFromWishlist,
    ]
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

  // Load wishlist on mount if user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadWishlist();
    }
  }, [isLoggedIn, loadWishlist]);

  // Populate wishlist with product details when products are loaded
  useEffect(() => {
    populateWishlistWithProductDetails();
  }, [populateWishlistWithProductDetails]);

  return {
    wishlist,
    isInWishlist,
    toggleWishlistItem,
    loadWishlist,
    syncWishlist,
    getWishlistCount,
  };
};

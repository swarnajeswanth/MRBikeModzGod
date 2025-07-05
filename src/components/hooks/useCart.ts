import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/components/store";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectCartItemById,
  selectIsItemInCart,
  selectAddCartLoading,
  selectRemoveCartLoading,
  selectUpdateCartLoading,
  selectClearCartLoading,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  CartItem,
} from "@/components/store/cartSlice";

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);

  // Individual loading states
  const addLoading = useSelector(selectAddCartLoading);
  const removeLoading = useSelector(selectRemoveCartLoading);
  const updateLoading = useSelector(selectUpdateCartLoading);
  const clearLoading = useSelector(selectClearCartLoading);

  // Helper functions
  const getItemById = (productId: string) =>
    useSelector((state: RootState) => selectCartItemById(state, productId));

  const isItemInCart = (productId: string) =>
    useSelector((state: RootState) => selectIsItemInCart(state, productId));

  // Actions
  const addItem = async (product: Omit<CartItem, "quantity">) => {
    try {
      const result = await dispatch(addToCart(product)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to add item to cart",
      };
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      return { success: true };
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove item from cart",
      };
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await dispatch(updateCartItemQuantity({ productId, quantity })).unwrap();
      return { success: true };
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update cart item quantity",
      };
    }
  };

  const clearAll = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      return { success: true };
    } catch (error) {
      console.error("Failed to clear cart:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to clear cart",
      };
    }
  };

  return {
    // State
    items,
    total,
    itemCount,
    loading,
    error,

    // Individual loading states
    addLoading,
    removeLoading,
    updateLoading,
    clearLoading,

    // Helpers
    getItemById,
    isItemInCart,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearAll,
  };
};

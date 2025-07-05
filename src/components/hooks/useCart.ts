import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/components/store";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectCartItemById,
  selectIsItemInCart,
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

  // Helper functions
  const getItemById = (productId: string) =>
    useSelector((state: RootState) => selectCartItemById(state, productId));

  const isItemInCart = (productId: string) =>
    useSelector((state: RootState) => selectIsItemInCart(state, productId));

  // Actions
  const addItem = async (product: Omit<CartItem, "quantity">) => {
    try {
      await dispatch(addToCart(product));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await dispatch(removeFromCart(productId));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await dispatch(updateCartItemQuantity({ productId, quantity }));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const clearAll = async () => {
    try {
      await dispatch(clearCart());
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    // State
    items,
    total,
    itemCount,
    loading,
    error,

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

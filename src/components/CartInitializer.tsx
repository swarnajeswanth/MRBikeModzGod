"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCartItems } from "@/components/store/cartSlice";

const CartInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load cart from localStorage on app startup
    try {
      const persistedState = localStorage.getItem("persist:root");
      if (persistedState) {
        const parsedState = JSON.parse(persistedState);
        if (parsedState.cart) {
          const cartState = JSON.parse(parsedState.cart);
          if (cartState.items && Array.isArray(cartState.items)) {
            console.log(
              "Loading cart items from localStorage:",
              cartState.items
            );
            dispatch(setCartItems(cartState.items));
          }
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default CartInitializer;

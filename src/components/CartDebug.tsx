"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/components/store";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
} from "@/components/store/cartSlice";

const CartDebug = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemCount = useSelector(selectCartItemCount);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">Cart Debug</h3>
      <div>Items: {cartItemCount}</div>
      <div>Total: ₹{cartTotal.toFixed(2)}</div>
      <div>Item Count: {cartItems.length}</div>
      <details className="mt-2">
        <summary className="cursor-pointer">Items</summary>
        <div className="mt-1 space-y-1">
          {cartItems.map((item, index) => (
            <div key={index} className="text-xs">
              {item.name} x{item.quantity} - ₹{item.price}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

export default CartDebug;

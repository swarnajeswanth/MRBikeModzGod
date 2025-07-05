"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Tag,
  ArrowRight,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectIsPageAccessible } from "@/components/store/storeSettingsSlice";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import { RootState, AppDispatch } from "@/components/store";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  updateCartItemQuantity,
  removeFromCart,
} from "@/components/store/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const isCartAccessible = useSelector(selectIsPageAccessible("cart"));

  if (!isCartAccessible) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black/80">
        <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
        <p className="text-gray-400 mb-4">
          This page is currently not accessible.
        </p>
      </div>
    );
  }

  // Get cart data from Redux
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemCount = useSelector(selectCartItemCount);

  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    await dispatch(updateCartItemQuantity({ productId: id, quantity: newQty }));
  };

  const removeItem = async (id: string) => {
    await dispatch(removeFromCart(id));
  };

  const subtotal = cartTotal;
  const shipping = cartItems.length ? 25 : 0;
  const tax = +(subtotal * 0.1).toFixed(2);
  const total = subtotal + shipping + tax;

  return (
    <GuestAccessGuard>
      <div className="min-h-screen bg-[#0D1117] py-10 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
          Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="max-w-xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 sm:p-12 text-center">
            <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-6">
              Add some products to get started
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Product Image/Icon */}
                    <div className="w-76 h-76 sm:w-20 sm:h-20 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg truncate">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{item.category}</p>
                      <p className="text-red-400 font-bold text-lg">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-8 w-8 flex items-center justify-center border border-gray-600 text-gray-300 rounded"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-white font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-8 w-8 flex items-center justify-center border border-gray-600 text-gray-300 rounded"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="h-8 px-3 flex items-center justify-center border border-red-600 text-red-400 hover:bg-red-600/20 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side - Summary */}
            <div className="space-y-6">
              {/* Promo Code */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 sm:p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Promo Code
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-700">
                    Apply
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 sm:p-6">
                <h3 className="text-white font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3 flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white text-lg py-3 rounded flex items-center justify-center">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>

              {/* Continue Shopping */}
              <button className="w-full border border-gray-600 text-gray-300 hover:bg-gray-800 py-2 rounded">
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </GuestAccessGuard>
  );
}

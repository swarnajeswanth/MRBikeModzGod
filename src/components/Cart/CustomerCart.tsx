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
import { FaBox } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/components/store";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectClearCartLoading,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "@/components/store/cartSlice";
import { toast } from "react-hot-toast";

const CustomerCart = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Get cart data from Redux
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemCount = useSelector(selectCartItemCount);
  const clearCartLoading = useSelector(selectClearCartLoading);

  const [promoCode, setPromoCode] = useState("");

  // Customer cart functions
  const updateQuantity = async (id: string, newQty: number) => {
    await dispatch(updateCartItemQuantity({ productId: id, quantity: newQty }));
  };

  const removeItem = async (id: string) => {
    await dispatch(removeFromCart(id));
  };

  const clearRegularCart = async () => {
    try {
      await dispatch(clearCart());
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  const subtotal = cartTotal;
  const shipping = cartItems.length ? 25 : 0;
  const tax = +(subtotal * 0.1).toFixed(2);
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 sm:p-12 text-center">
        <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-400 mb-6">Add some products to get started</p>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          onClick={() => (window.location.href = "/")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-2 sm:p-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Product Image */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.image && item.image.trim() !== "" ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.png";
                    }}
                  />
                ) : (
                  <FaBox className="text-gray-400 text-lg sm:text-xl" />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm sm:text-lg truncate">
                  {item.name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {item.category}
                </p>
                <p className="text-red-400 font-bold text-base sm:text-lg">
                  ₹{item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity & Remove */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={() => {
                      item.quantity === 1
                        ? removeItem(item.id)
                        : updateQuantity(item.id, item.quantity - 1);
                    }}
                    className="h-7 w-7 flex items-center justify-center border border-gray-600 text-gray-300 rounded text-xs sm:text-base"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-white font-medium w-6 sm:w-8 text-center text-xs sm:text-base">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => {
                      updateQuantity(item.id, item.quantity + 1);
                    }}
                    className="h-7 w-7 flex items-center justify-center border border-gray-600 text-gray-300 rounded text-xs sm:text-base"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="h-7 px-2 flex items-center justify-center border border-red-600 text-red-400 hover:bg-red-600/20 rounded text-xs sm:text-base"
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
          <div className="mt-6 space-y-2">
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 rounded flex items-center justify-center"
              onClick={() => (window.location.href = "/checkout")}
            >
              Proceed to Checkout
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={clearRegularCart}
              disabled={clearCartLoading}
              className="w-full px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear all items from cart"
            >
              {clearCartLoading ? "Clearing..." : "Clear Cart"}
            </button>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <button
          className="w-full border border-gray-600 text-gray-300 hover:bg-gray-800 py-2 rounded"
          onClick={() => (window.location.href = "/")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CustomerCart;

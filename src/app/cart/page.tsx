import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Tag,
} from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Performance Air Filter",
      price: 89.99,
      quantity: 2,
      image: "/placeholder.svg",
      category: "Engine Parts",
    },
    {
      id: 2,
      name: "Sport Exhaust System",
      price: 299.99,
      quantity: 1,
      image: "/placeholder.svg",
      category: "Exhaust",
    },
    {
      id: 3,
      name: "LED Headlights",
      price: 159.99,
      quantity: 1,
      image: "/placeholder.svg",
      category: "Electronics",
    },
  ]);

  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 15.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-400">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <div className="p-8 sm:p-12 text-center">
              <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-400 mb-6">
                Add some products to get started
              </p>
              <Button className="bg-red-600 hover:bg-red-700">
                Continue Shopping
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="bg-gray-800/50 backdrop-blur-sm border-gray-700"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg truncate">
                          {item.name}
                        </h3>
                        <p className="text-gray-400 text-sm">{item.category}</p>
                        <p className="text-red-400 font-bold text-lg">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Controls - Mobile Layout */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 h-8 w-8 p-0 flex-shrink-0"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="text-white font-medium w-8 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 h-8 w-8 p-0 flex-shrink-0"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-600/20 h-8 px-3"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Promo Code */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <div className="p-4 sm:p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Promo Code
                  </h3>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 whitespace-nowrap"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Order Summary */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <div className="p-4 sm:p-6">
                  <h3 className="text-white font-semibold mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-300">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-300">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>

                    <div className="border-t border-gray-600 pt-3">
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-lg py-3">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

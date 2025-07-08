"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { FaBox } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store";
import { toast } from "react-hot-toast";

const RetailerCart = () => {
  const user = useSelector((state: RootState) => state.user);

  // Retailer-specific state
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [miscNote, setMiscNote] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [dateAutoSet, setDateAutoSet] = useState(false);
  const [clearRetailerCartLoading, setClearRetailerCartLoading] =
    useState(false);

  // Helper to get YYYY-MM-DD string
  const formatDate = (date: Date) => date.toISOString().slice(0, 10);
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Retailer cart state for selected date (date-keyed)
  const [cartByDate, setCartByDate] = useState<{ [date: string]: any[] }>({});
  const [miscNoteByDate, setMiscNoteByDate] = useState<{
    [date: string]: string;
  }>({});
  const formattedDate = formatDate(selectedDate);
  const retailerCartItems = cartByDate[formattedDate] || [];
  const retailerMiscNote = miscNoteByDate[formattedDate] || "";

  const currentCartTotal = retailerCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Retailer cart functions
  const addToRetailerCart = (product: any) => {
    setCartByDate((prev) => {
      const prevCart = prev[formattedDate] || [];
      const existing = prevCart.find((item) => item.productId === product.id);
      let newCart;
      if (existing) {
        newCart = prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image:
              product.images && product.images.length > 0
                ? product.images[0]
                : product.image || "",
            category: product.category,
          },
        ];
      }
      const updatedCart = { ...prev, [formattedDate]: newCart };
      // Always sync with database after cart change
      if (newCart.length > 0) {
        syncCartWithDatabase(newCart);
      } else {
        handleDeleteOrderFromDB();
      }
      return updatedCart;
    });
  };

  const removeFromRetailerCart = (productId: string) => {
    setCartByDate((prev) => {
      const prevCart = prev[formattedDate] || [];
      const newCart = prevCart.filter((item) => item.productId !== productId);
      // Always sync with database after cart change
      if (newCart.length > 0) {
        syncCartWithDatabase(newCart);
      } else {
        handleDeleteOrderFromDB();
      }
      return { ...prev, [formattedDate]: newCart };
    });
  };

  // Function to delete order from database when all items are removed
  const handleDeleteOrderFromDB = async () => {
    try {
      const userId = user.id || "retailer-demo";
      const res = await fetch(
        `/api/orders?userId=${userId}&date=${formatDate(selectedDate)}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Order deleted from database");
        // Set flag to notify dashboard to refresh stats
        localStorage.setItem("orderUpdated", Date.now().toString());
      } else if (res.status === 404) {
        toast("No order to delete for this date");
      } else {
        toast.error("Failed to delete order from database");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order from database");
    }
  };

  const updateRetailerQuantity = (productId: string, qty: number) => {
    setCartByDate((prev) => {
      const prevCart = prev[formattedDate] || [];
      let newCart;
      if (qty <= 0) {
        newCart = prevCart.filter((item) => item.productId !== productId);
      } else {
        newCart = prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: qty } : item
        );
      }
      // Always sync with database after cart change
      if (newCart.length > 0) {
        syncCartWithDatabase(newCart);
      } else {
        handleDeleteOrderFromDB();
      }
      return { ...prev, [formattedDate]: newCart };
    });
  };

  const setRetailerMiscNote = (note: string) => {
    setMiscNoteByDate((prev) => ({ ...prev, [formattedDate]: note }));
  };

  const clearRetailerCart = async () => {
    setClearRetailerCartLoading(true);
    try {
      // If this was a past order, delete it from database
      if (isEditingPastOrder()) {
        await handleDeleteOrderFromDB();
      } else {
        // For current date, create an empty order to maintain consistency
        try {
          const userId = user.id || "retailer-demo";
          const orderData = {
            userId,
            items: [],
            total: 0,
            status: "pending",
            createdAt: selectedDate.toISOString(),
            misc: "",
          };

          const res = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          });

          const data = await res.json();
          if (data.success) {
            console.log("Empty order created for date:", formattedDate);
            localStorage.setItem("orderUpdated", Date.now().toString());
          }
        } catch (error) {
          console.error("Error creating empty order:", error);
        }
      }

      // Only clear cart and notes for the selected date
      setCartByDate((prev) => ({ ...prev, [formattedDate]: [] }));
      setMiscNoteByDate((prev) => ({ ...prev, [formattedDate]: "" }));
      // Do NOT reset selectedDate or localStorage.setItem("retailerSelectedDate", ...)
      toast.success("Cart cleared for this date");
    } catch (error) {
      toast.error("Failed to clear cart");
    } finally {
      setClearRetailerCartLoading(false);
    }
  };

  // Load cart and notes from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("retailerCartByDate");
    if (savedCart) setCartByDate(JSON.parse(savedCart));

    const savedNotes = localStorage.getItem("retailerMiscNoteByDate");
    if (savedNotes) setMiscNoteByDate(JSON.parse(savedNotes));

    // Load selected date from localStorage
    const savedDate = localStorage.getItem("retailerSelectedDate");
    if (savedDate) {
      const parsedDate = new Date(savedDate);
      if (parsedDate.getMonth() === today.getMonth()) {
        setSelectedDate(parsedDate);
        setDateAutoSet(true);
      }
    }
  }, []);

  // Save cart and notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("retailerCartByDate", JSON.stringify(cartByDate));
  }, [cartByDate]);

  useEffect(() => {
    localStorage.setItem(
      "retailerMiscNoteByDate",
      JSON.stringify(miscNoteByDate)
    );
  }, [miscNoteByDate]);

  // Listen for cart updates from AddToCart component
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "retailerCartByDate" && e.newValue) {
        try {
          const updatedCart = JSON.parse(e.newValue);
          setCartByDate(updatedCart);
          console.log("Cart updated from storage event:", updatedCart);

          // Sync with database if cart was updated from another component
          const currentCartForDate = updatedCart[formattedDate];
          if (currentCartForDate && currentCartForDate.length > 0) {
            syncCartWithDatabase(currentCartForDate);
          }
        } catch (error) {
          console.error("Error parsing cart data from storage event:", error);
        }
      }
    };

    const handleRetailerCartUpdated = () => {
      const savedCart = localStorage.getItem("retailerCartByDate");
      if (savedCart) {
        // Always create a new object reference to force re-render
        const updatedCart = JSON.parse(savedCart);
        setCartByDate({ ...updatedCart });
        console.log(
          "Cart updated from retailerCartUpdated event (new object reference)"
        );

        // Sync with database if cart was updated from another component
        const currentCartForDate = updatedCart[formattedDate];
        if (currentCartForDate && currentCartForDate.length > 0) {
          syncCartWithDatabase(currentCartForDate);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("retailerCartUpdated", handleRetailerCartUpdated);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "retailerCartUpdated",
        handleRetailerCartUpdated
      );
    };
  }, [formattedDate]);

  // Function to sync cart with database
  const syncCartWithDatabase = async (cartItems: any[]) => {
    try {
      const userId = user.id || "retailer-demo";
      const orderData = {
        userId,
        items: cartItems.map((item: any) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: cartItems.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        ),
        status: "pending",
        createdAt: selectedDate.toISOString(),
        misc: retailerMiscNote,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (data.success) {
        console.log("Cart synced with database for date:", formattedDate);
        // Set flag to notify dashboard to refresh stats
        localStorage.setItem("orderUpdated", Date.now().toString());
      } else {
        console.error("Failed to sync cart with database:", data.message);
      }
    } catch (error) {
      console.error("Error syncing cart with database:", error);
    }
  };

  // Always re-read cart data from localStorage when selectedDate changes
  useEffect(() => {
    const savedCart = localStorage.getItem("retailerCartByDate");
    if (savedCart) setCartByDate(JSON.parse(savedCart));
  }, [selectedDate]);

  // Fetch existing order for selected date (only if no local cart data exists)
  useEffect(() => {
    const fetchCartForDate = async () => {
      try {
        // Check if we already have cart data for this date in localStorage
        const currentCartForDate = cartByDate[formattedDate];
        if (currentCartForDate && currentCartForDate.length > 0) {
          // We already have local cart data, don't override it
          return;
        }

        const userId = user.id || "retailer-demo";
        const res = await fetch(
          `/api/orders?month=${formatDate(selectedDate).slice(
            0,
            7
          )}&userId=${userId}`
        );
        const data = await res.json();
        if (data.success && data.orders) {
          const orderForDate = data.orders.find((order: any) => {
            const orderDate = new Date(order.createdAt);
            return formatDate(orderDate) === formatDate(selectedDate);
          });

          if (orderForDate) {
            // Load existing order into cart only if we don't have local data
            setCartByDate((prev) => ({
              ...prev,
              [formattedDate]: orderForDate.items.map((item: any) => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              })),
            }));
            setMiscNoteByDate((prev) => ({
              ...prev,
              [formattedDate]: orderForDate.misc || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching cart for date:", error);
      }
    };

    fetchCartForDate();
  }, [selectedDate, user.id, formattedDate, cartByDate]);

  const isEditingPastOrder = () => {
    const today = new Date();
    const selected = new Date(selectedDate);
    return (
      selected.getDate() !== today.getDate() ||
      selected.getMonth() !== today.getMonth() ||
      selected.getFullYear() !== today.getFullYear()
    );
  };

  const isToday = () => {
    const today = new Date();
    const selected = new Date(selectedDate);
    return (
      selected.getDate() === today.getDate() &&
      selected.getMonth() === today.getMonth() &&
      selected.getFullYear() === today.getFullYear()
    );
  };

  const handleRetailerCheckout = async () => {
    if (retailerCartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setCheckoutLoading(true);
    try {
      const userId = user.id || "retailer-demo";
      const orderData = {
        userId,
        items: retailerCartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: currentCartTotal,
        status: "paid",
        createdAt: selectedDate.toISOString(),
        misc: retailerMiscNote,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (data.success) {
        const message = isEditingPastOrder()
          ? "Past order updated successfully!"
          : "Order added for selected date!";
        toast.success(message);

        // Set flag to notify dashboard to refresh stats
        localStorage.setItem("orderUpdated", Date.now().toString());

        // Don't clear cart - keep it for potential further edits
      } else {
        toast.error(data.message || "Failed to save order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Failed to save order");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const total = currentCartTotal;

  // Debug logging
  useEffect(() => {
    console.log("RetailerCart Debug:", {
      selectedDate: selectedDate.toISOString(),
      formattedDate,
      cartByDate,
      retailerCartItems,
      cartByDateKeys: Object.keys(cartByDate),
      currentCartForDate: cartByDate[formattedDate],
    });
  }, [selectedDate, formattedDate, cartByDate, retailerCartItems]);

  // Always render the date picker at the top
  return (
    <div className="w-full text-white p-6 rounded-lg shadow-lg">
      {/* Date Picker - always visible for retailers */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <label className="font-semibold text-gray-300">Select Date:</label>
        <input
          type="date"
          className="bg-gray-800 text-white rounded px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={formatDate(selectedDate)}
          onChange={(e) => {
            const newDate = new Date(e.target.value);
            setSelectedDate(newDate);
            localStorage.setItem("retailerSelectedDate", newDate.toISOString());
          }}
        />
      </div>
      {/* Auto-date indicator */}
      {/* {user.isLoggedIn && (
        <div
          className={`max-w-xl mx-auto border rounded-lg p-3 mb-4 transition-all duration-300 ${
            dateAutoSet
              ? "bg-green-600/30 border-green-600/70 shadow-lg shadow-green-600/20"
              : "bg-green-600/20 border-green-600/50"
          }`}
        >
          <div className="text-green-300 text-sm">
            <p className="font-medium mb-1">
              📅 Auto-Date Feature {dateAutoSet && "✨"}
            </p>
            <ul className="text-xs space-y-1">
              <li>• Date automatically set to today on login</li>
              <li>• Date persists across browser sessions</li>
              <li>• Manually change date anytime using the picker above</li>
              {dateAutoSet && (
                <li className="text-green-200 font-medium">
                  • Date just updated to: {selectedDate.toLocaleDateString()}
                </li>
              )}
            </ul>
          </div>
        </div>
      )} */}

      {/* Helpful notes */}
      {/* <div className="max-w-xl mx-auto bg-blue-600/20 border border-blue-600/50 rounded-lg p-3 mb-6">
        <div className="text-blue-300 text-sm">
          <p className="font-medium mb-1">💡 How it works:</p>
          <ul className="text-xs space-y-1">
            <li>• Cart items persist when switching dates</li>
            <li>• Past orders can be edited (current month only)</li>
            <li>• Use "Clear" to start fresh for any date</li>
            <li>
              • Removing all items from a past order deletes it from database
            </li>
          </ul>
        </div>
      </div> */}

      {/* Debug Info - Remove this after testing */}
      {/* <div className="max-w-xl mx-auto bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-3 mb-6">
        <div className="text-yellow-300 text-sm">
          <p className="font-medium mb-1">🐛 Debug Info:</p>
          <ul className="text-xs space-y-1">
            <li>• Selected Date: {selectedDate.toLocaleDateString()}</li>
            <li>• Formatted Date: {formattedDate}</li>
            <li>• Cart Items Count: {retailerCartItems.length}</li>
            <li>
              • All Dates with Cart Data:{" "}
              {Object.keys(cartByDate).join(", ") || "None"}
            </li>
            <li>• Current Cart Total: ₹{total.toFixed(2)}</li>
          </ul>
          <button
            onClick={() => {
              const savedCart = localStorage.getItem("retailerCartByDate");
              console.log("Manual refresh - localStorage cart:", savedCart);
              if (savedCart) {
                setCartByDate(JSON.parse(savedCart));
              }
            }}
            className="mt-2 px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
          >
            Refresh Cart Data
          </button>
        </div>
      </div> */}

      {retailerCartItems.length === 0 ? (
        <div className="max-w-xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 sm:p-12 text-center">
          <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Your cart is empty for {selectedDate.toLocaleDateString()}
          </h2>
          <p className="text-gray-400 mb-6">Add some products to get started</p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={() => (window.location.href = "/")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Show warning if editing past order */}
            {isEditingPastOrder() && (
              <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-sm font-medium">
                    ⚠️ Editing Past Order
                  </span>
                  <span className="text-yellow-300 text-xs">
                    You're modifying an order from{" "}
                    {selectedDate.toLocaleDateString()}. Removing all items will
                    delete this order.
                  </span>
                </div>
              </div>
            )}

            {retailerCartItems.map((item) => (
              <div
                key={item.productId}
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
                            ? removeFromRetailerCart(item.productId)
                            : updateRetailerQuantity(
                                item.productId,
                                item.quantity - 1
                              );
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
                          updateRetailerQuantity(
                            item.productId,
                            item.quantity + 1
                          );
                        }}
                        className="h-7 w-7 flex items-center justify-center border border-gray-600 text-gray-300 rounded text-xs sm:text-base"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromRetailerCart(item.productId)}
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
            {/* Order Summary */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 sm:p-6">
              <h3 className="text-white font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-600 pt-3 flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3 rounded flex items-center justify-center"
                  onClick={handleRetailerCheckout}
                  disabled={checkoutLoading || retailerCartItems.length === 0}
                >
                  {checkoutLoading
                    ? "Processing..."
                    : isEditingPastOrder()
                    ? "Update Past Order"
                    : "Save Order"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={clearRetailerCart}
                  disabled={clearRetailerCartLoading}
                  className="w-full px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Clear cart for this date"
                >
                  {clearRetailerCartLoading ? "Clearing..." : "Clear Cart"}
                </button>
              </div>
            </div>

            {/* Back Button */}
            <button
              className="w-full border border-gray-600 text-gray-300 hover:bg-gray-800 py-2 rounded"
              onClick={() => (window.location.href = "/")}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailerCart;

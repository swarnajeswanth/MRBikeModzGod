"use client";
import { useCart } from "@/components/hooks/useCart";
import { toast } from "react-hot-toast";

const CartTest = () => {
  const { items, total, itemCount, addItem, removeItem, clearAll } = useCart();

  const testProduct = {
    id: "test-product-1",
    name: "Test Product",
    price: 99.99,
    category: "Test Category",
    image: "",
  };

  const handleAddTestItem = async () => {
    const result = await addItem(testProduct);
    if (result.success) {
      toast.success("Test product added to cart!");
    } else {
      toast.error("Failed to add test product");
    }
  };

  const handleRemoveTestItem = async () => {
    const result = await removeItem("test-product-1");
    if (result.success) {
      toast.success("Test product removed from cart!");
    } else {
      toast.error("Failed to remove test product");
    }
  };

  const handleClearCart = async () => {
    const result = await clearAll();
    if (result.success) {
      toast.success("Cart cleared!");
    } else {
      toast.error("Failed to clear cart");
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
      <h3 className="text-white font-semibold mb-4">Cart Test Panel</h3>

      <div className="space-y-2 mb-4">
        <p className="text-gray-300">Items in cart: {itemCount}</p>
        <p className="text-gray-300">Total: ₹{total.toFixed(2)}</p>
        <p className="text-gray-300">Unique items: {items.length}</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleAddTestItem}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Add Test Product
        </button>

        <button
          onClick={handleRemoveTestItem}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Remove Test Product
        </button>

        <button
          onClick={handleClearCart}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
        >
          Clear Cart
        </button>
      </div>

      {items.length > 0 && (
        <div className="mt-4">
          <h4 className="text-white font-medium mb-2">Cart Items:</h4>
          <div className="space-y-1">
            {items.map((item) => (
              <div key={item.id} className="text-gray-300 text-sm">
                {item.name} - Qty: {item.quantity} - ₹{item.price.toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartTest;

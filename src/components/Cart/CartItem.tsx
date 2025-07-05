import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import LoadingButton from "../Loaders/LoadingButton";
import { useState } from "react";

interface CartItemProps {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({
  id,
  name,
  category,
  price,
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  const [loadingStates, setLoadingStates] = useState({
    increment: false,
    decrement: false,
    remove: false,
  });

  const handleIncrement = async () => {
    setLoadingStates((prev) => ({ ...prev, increment: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      onIncrement(id);
    } finally {
      setLoadingStates((prev) => ({ ...prev, increment: false }));
    }
  };

  const handleDecrement = async () => {
    setLoadingStates((prev) => ({ ...prev, decrement: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      onDecrement(id);
    } finally {
      setLoadingStates((prev) => ({ ...prev, decrement: false }));
    }
  };

  const handleRemove = async () => {
    setLoadingStates((prev) => ({ ...prev, remove: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      onRemove(id);
    } finally {
      setLoadingStates((prev) => ({ ...prev, remove: false }));
    }
  };

  return (
    <div className="flex items-center justify-between bg-[#0D1117] border border-[#1F2937] p-4 rounded-lg mb-4">
      {/* Product Info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">{name}</h3>
          <p className="text-gray-400 text-sm">{category}</p>
          <p className="text-red-400 font-bold text-md mt-1">
            ${price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center gap-2">
        <LoadingButton
          onClick={handleDecrement}
          loading={loadingStates.decrement}
          loadingText=""
          variant="secondary"
          size="sm"
          className="w-8 h-8 p-0 bg-white text-black hover:bg-gray-200"
          icon={<Minus size={16} />}
        />
        <span className="text-white font-semibold min-w-[2rem] text-center">
          {quantity}
        </span>
        <LoadingButton
          onClick={handleIncrement}
          loading={loadingStates.increment}
          loadingText=""
          variant="secondary"
          size="sm"
          className="w-8 h-8 p-0 bg-white text-black hover:bg-gray-200"
          icon={<Plus size={16} />}
        />
        <LoadingButton
          onClick={handleRemove}
          loading={loadingStates.remove}
          loadingText=""
          variant="danger"
          size="sm"
          className="w-8 h-8 p-0 bg-red-600 hover:bg-red-700"
          icon={<Trash2 size={16} />}
        />
      </div>
    </div>
  );
}

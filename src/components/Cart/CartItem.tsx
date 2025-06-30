import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

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
        <button
          className="w-8 h-8 rounded bg-white text-black flex items-center justify-center hover:bg-gray-200"
          onClick={() => onDecrement(id)}
        >
          <Minus size={16} />
        </button>
        <span className="text-white font-semibold">{quantity}</span>
        <button
          className="w-8 h-8 rounded bg-white text-black flex items-center justify-center hover:bg-gray-200"
          onClick={() => onIncrement(id)}
        >
          <Plus size={16} />
        </button>
        <button
          className="w-8 h-8 rounded bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
          onClick={() => onRemove(id)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

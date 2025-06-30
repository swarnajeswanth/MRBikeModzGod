"use client";
import React from "react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: ProductForm) => void;
  form: ProductForm;
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
}

export interface ProductForm {
  name: string;
  category: string;
  price: string;
  stock: string;
  description?: string;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-color-black backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[#1E293B] text-white rounded-lg p-6 w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Product</h2>
          <button onClick={onClose} className="text-gray-400 text-lg">
            ×
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Enter product name"
            className="w-full p-2 rounded bg-[#334155] text-white"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="e.g., Engine Parts, Electronics"
            className="w-full p-2 rounded bg-[#334155] text-white"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Price ($)"
              className="w-full p-2 rounded bg-[#334155] text-white"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              className="w-full p-2 rounded bg-[#334155] text-white"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />
          </div>
          <textarea
            placeholder="Product description..."
            className="w-full p-2 rounded bg-[#334155] text-white"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;

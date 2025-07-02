"use client";
import React from "react";

export interface ProductForm {
  name: string;
  title: string;
  category: string;
  price: string;
  originalPrice: string;
  discount: string;
  stockCount: string;
  inStock: boolean;
  rating: string;
  reviews: string;
  description: string;
  features: string[]; // should be array
  specifications: Record<string, string>;
  label: string;
  labelType: string;
  backgroundColor: string;
  images: string[]; // should be array
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: ProductForm) => void;
  form: ProductForm;
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
}) => {
  if (!isOpen) return null;

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1E293B] text-white rounded-lg p-6 w-[95%] max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {form.name ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-gray-400 text-lg">
            ×
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Column 1 */}
          <input
            name="name"
            placeholder="Product name"
            className="input"
            value={form.name}
            onChange={handleInput}
            required
          />
          <input
            name="title"
            placeholder="Product title"
            className="input"
            value={form.title}
            onChange={handleInput}
          />

          <input
            name="category"
            placeholder="Category"
            className="input"
            value={form.category}
            onChange={handleInput}
            required
          />
          <input
            name="price"
            type="number"
            placeholder="Price ($)"
            className="input"
            value={form.price}
            onChange={handleInput}
            required
          />

          <input
            name="originalPrice"
            type="number"
            placeholder="Original Price ($)"
            className="input"
            value={form.originalPrice}
            onChange={handleInput}
          />
          <input
            name="discount"
            placeholder="Discount (%)"
            className="input"
            value={form.discount}
            onChange={handleInput}
          />

          <input
            name="stockCount"
            type="number"
            placeholder="Stock Count"
            className="input"
            value={form.stockCount}
            onChange={handleInput}
            required
          />
          <div className="flex items-center space-x-2 pl-2">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, inStock: e.target.checked }))
              }
            />
            <label className="text-sm">In Stock</label>
          </div>

          <input
            name="rating"
            type="number"
            step="0.1"
            placeholder="Rating (e.g., 4.5)"
            className="input"
            value={form.rating}
            onChange={handleInput}
          />
          <input
            name="reviews"
            type="number"
            placeholder="Review Count"
            className="input"
            value={form.reviews}
            onChange={handleInput}
          />

          <input
            name="features"
            placeholder="Features (comma-separated)"
            className="input col-span-1 md:col-span-2"
            value={form.features.join(", ")}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                features: e.target.value.split(",").map((f) => f.trim()),
              }))
            }
          />

          <textarea
            name="description"
            placeholder="Description"
            rows={2}
            className="input col-span-1 md:col-span-2"
            value={form.description}
            onChange={handleInput}
          />

          {/* <textarea
            name="specifications"
            placeholder='Specifications (JSON: {"Material": "Steel"})'
            className="input col-span-1 md:col-span-2"
            value={JSON.stringify(form.specifications, null, 2)}
            onChange={(e) => {
              try {
                setForm((prev) => ({
                  ...prev,
                  specifications: JSON.parse(e.target.value),
                }));
              } catch {}
            }}
            rows={3}
          /> */}

          <input
            name="label"
            placeholder="Label (e.g., SALE)"
            className="input"
            value={form.label}
            onChange={handleInput}
          />
          <input
            name="labelType"
            placeholder="Label Type (e.g., sale)"
            className="input"
            value={form.labelType}
            onChange={handleInput}
          />
          <input
            name="backgroundColor"
            placeholder="Background Color (e.g., #a855f7)"
            className="input"
            value={form.backgroundColor}
            onChange={handleInput}
          />

          <input
            name="images"
            placeholder="Images (comma-separated URLs)"
            className="input col-span-1 md:col-span-2"
            value={form.images.join(", ")}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                images: e.target.value.split(",").map((img) => img.trim()),
              }))
            }
          />

          {/* Buttons - full width on large screen */}
          <div className="col-span-1 md:col-span-2 flex justify-end gap-2 pt-4">
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
              {form.name ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;

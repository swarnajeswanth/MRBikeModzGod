"use client";
import React, { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import LoadingButton from "@/components/Loaders/LoadingButton";

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
  specifications: string[]; // changed to array like features
  label: string;
  labelType: string;
  images: string[]; // should be array
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: ProductForm) => void;
  form: ProductForm;
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>;
  loading?: boolean;
}

const STEPS = ["Basic Info", "Details", "Images", "Review & Submit"];

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  loading,
}) => {
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // No need for titleManuallyEdited since title is always name
  const [priceEditMode, setPriceEditMode] = useState<
    "discount" | "originalPrice"
  >("originalPrice");

  // Auto-calculate price from originalPrice and discount
  React.useEffect(() => {
    const { originalPrice, discount } = form;
    if (form.originalPrice && form.discount) {
      const op = parseFloat(form.originalPrice);
      const d = parseFloat(form.discount);
      if (!isNaN(op) && !isNaN(d)) {
        const p = (op * (1 - d / 100)).toFixed(2);
        setForm((prev) => ({ ...prev, price: p }));
      }
    }
    // eslint-disable-next-line
  }, [form.originalPrice, form.discount]);

  // Step validation
  const validateStep = () => {
    if (currentStep === 0) {
      if (
        !form.name ||
        !form.category ||
        !form.originalPrice ||
        !form.discount ||
        !form.stockCount
      ) {
        toast.error(
          "Name, category, original price, discount, and stock count are required."
        );
        return false;
      }
      if (
        isNaN(Number(form.originalPrice)) ||
        Number(form.originalPrice) <= 0
      ) {
        toast.error("Original price must be a valid number greater than 0.");
        return false;
      }
      if (isNaN(Number(form.discount))) {
        toast.error("Discount must be a valid number.");
        return false;
      }
    }
    if (currentStep === 1) {
      if (!form.description) {
        toast.error("Description is required.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!form.images[0]) {
        toast.error("At least one product image is required.");
        return false;
      }
    }
    return true;
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Discount/originalPrice field focus handlers
  const handleFocus = (field: "discount" | "originalPrice") => {
    setPriceEditMode(field);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, images: [data.url] }));
        toast.success("Image uploaded!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Stepper UI
  const renderStepper = () => (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((step, idx) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 transition-all duration-200 ${
                idx === currentStep
                  ? "bg-red-600 text-white border-red-600 scale-110 shadow-lg"
                  : idx < currentStep
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-gray-700 text-gray-300 border-gray-500"
              }`}
            >
              {idx + 1}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                idx === currentStep
                  ? "text-red-400"
                  : idx < currentStep
                  ? "text-green-400"
                  : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className="w-8 h-1 bg-gray-500 mx-2 rounded-full" />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Product name"
              className="input"
              value={form.name}
              onChange={handleInput}
              required
            />
            <input
              name="category"
              placeholder="Category"
              className="input"
              value={form.category}
              onChange={handleInput}
              required
            />
            {/* Only Original Price and Discount are editable; price is auto-calculated */}
            <input
              name="originalPrice"
              type="number"
              placeholder="Original Price (₹)"
              className="input"
              value={form.originalPrice}
              onChange={handleInput}
              onFocus={() => handleFocus("originalPrice")}
              required
            />
            <input
              name="discount"
              type="number"
              placeholder="Discount (%)"
              className="input"
              value={form.discount}
              onChange={handleInput}
              onFocus={() => handleFocus("discount")}
              required
            />
            <div className="flex items-center space-x-2 pl-2">
              <span className="text-sm text-gray-400">Price (auto):</span>
              <span className="font-semibold">₹{form.price || "0.00"}</span>
            </div>
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
              placeholder="Rating (optional)"
              className="input"
              value={form.rating}
              onChange={handleInput}
            />
            <input
              name="reviews"
              type="number"
              placeholder="Review Count (optional)"
              className="input"
              value={form.reviews}
              onChange={handleInput}
            />
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              name="description"
              placeholder="Description"
              rows={2}
              className="input col-span-1 md:col-span-2"
              value={form.description}
              onChange={handleInput}
              required
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
            <div className="col-span-1 md:col-span-2">
              <textarea
                name="specifications"
                placeholder="Specifications (comma-separated) - Example: Material: Steel, Weight: 500g, Size: Large, Color: Red"
                className="input w-full"
                value={
                  Array.isArray(form.specifications)
                    ? form.specifications.join(", ")
                    : ""
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    specifications: e.target.value
                      .split(",")
                      .map((f) => f.trim()),
                  }))
                }
                rows={3}
              />
              <div className="text-xs text-gray-400 mt-1">
                Example: Material: Steel, Weight: 500g, Size: Large, Color: Red
              </div>
            </div>
            <input
              name="label"
              placeholder="Label (e.g., SALE)"
              className="input"
              value={form.label}
              onChange={handleInput}
            />
            {/* Label Type removed, use label everywhere */}
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center gap-4">
            <label className="block text-sm mb-1">Product Image</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
              disabled={uploading}
            />
            {uploading && (
              <div className="text-xs text-yellow-400 mt-1">Uploading...</div>
            )}
            {form.images[0] && (
              <div className="mt-2">
                <img
                  src={form.images[0]}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border border-gray-700"
                />
                <div className="text-xs text-gray-400 mt-1">Image Preview</div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">
              Review Product Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Name:</span> {form.name}
              </div>
              <div>
                <span className="font-medium">Category:</span> {form.category}
              </div>
              <div>
                <span className="font-medium">Original Price:</span> ₹
                {form.originalPrice}
              </div>
              <div>
                <span className="font-medium">Discount:</span> {form.discount}%
              </div>
              <div>
                <span className="font-medium">Price (auto):</span> ₹
                {form.price || "0.00"}
              </div>
              <div>
                <span className="font-medium">Stock Count:</span>{" "}
                {form.stockCount}
              </div>
              <div>
                <span className="font-medium">In Stock:</span>{" "}
                {form.inStock ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-medium">Rating:</span>{" "}
                {form.rating || "-"}
              </div>
              <div>
                <span className="font-medium">Reviews:</span>{" "}
                {form.reviews || "-"}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Description:</span>{" "}
                {form.description}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Features:</span>{" "}
                {form.features.join(", ")}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Specifications:</span>{" "}
                {JSON.stringify(form.specifications)}
              </div>
              <div>
                <span className="font-medium">Label:</span> {form.label}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Image:</span>
                {form.images[0] && (
                  <img
                    src={form.images[0]}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded border border-gray-700 inline-block ml-2"
                  />
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Navigation buttons
  const renderNavigation = () => (
    <div className="flex justify-between items-center mt-8 gap-2">
      <button
        type="button"
        onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
        className={`px-4 py-2 rounded bg-gray-600 text-white ${
          currentStep === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-700"
        }`}
        disabled={currentStep === 0}
      >
        Back
      </button>
      {currentStep < STEPS.length - 1 ? (
        <button
          type="button"
          onClick={() => {
            if (validateStep()) setCurrentStep((s) => s + 1);
          }}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Next
        </button>
      ) : (
        <LoadingButton
          type="button"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          loading={loading}
          onClick={() => {
            if (validateStep()) onSubmit(form);
          }}
        >
          {form.name ? "Update Product" : "Add Product"}
        </LoadingButton>
      )}
    </div>
  );

  // On submit, ensure title=name, price is calculated, rating/reviews are set to 0 if empty, and labelType is not sent
  const handleFinalSubmit = () => {
    const { labelType, ...rest } = form;
    // Always set title = name
    // Always calculate price from originalPrice and discount
    const op = parseFloat(form.originalPrice);
    const d = parseFloat(form.discount);
    let price = "";
    if (!isNaN(op) && !isNaN(d)) {
      price = (op * (1 - d / 100)).toFixed(2);
    }
    const payload = {
      ...rest,
      title: form.name,
      price,
      rating: form.rating ? form.rating : 0,
      reviews: form.reviews ? form.reviews : 0,
    };
    onSubmit(payload as ProductForm);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] text-white rounded-lg p-6 w-[95%] max-w-2xl max-h-[95vh] overflow-y-auto relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 text-2xl hover:text-white"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2 text-center">
              {form.name ? "Edit Product" : "Add New Product"}
            </h2>
            {renderStepper()}
            <form onSubmit={(e) => e.preventDefault()} className="">
              {renderStepContent()}
              <div className="flex justify-between items-center mt-8 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                  className={`px-4 py-2 rounded bg-gray-600 text-white ${
                    currentStep === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-700"
                  }`}
                  disabled={currentStep === 0}
                >
                  Back
                </button>
                {currentStep < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep()) setCurrentStep((s) => s + 1);
                    }}
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Next
                  </button>
                ) : (
                  <LoadingButton
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    loading={loading}
                    onClick={handleFinalSubmit}
                  >
                    {form.name ? "Update Product" : "Add Product"}
                  </LoadingButton>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProductModal;

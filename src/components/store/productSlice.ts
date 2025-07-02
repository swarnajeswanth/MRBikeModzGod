// store/productSlice.ts
import { createSlice } from "@reduxjs/toolkit";

export type Product = {
  id: string;
  name: string;
  label: string;
  labelType: string;
  backgroundColor: string;
  category: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  discount: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  inStock: boolean;
  stockCount: number;
};

type ProductState = {
  products: Product[];
};

const initialState: ProductState = {
  products: [
    {
      id: "racing-brake-pads",
      name: "Racing Brake Pads",
      label: "SALE",
      labelType: "sale",
      backgroundColor: "#a855f7",
      category: "Brakes",
      title: "Racing Brake Pads",
      rating: 4.8,
      reviews: 178,
      price: 199.99,
      originalPrice: 249.99,
      discount: "20%",
      description:
        "High-performance racing brake pads designed for maximum stopping power and durability. Perfect for track days and aggressive street driving.",
      features: [
        "Superior heat dissipation",
        "Extended pad life",
        "Reduced brake fade",
        "Compatible with most brake systems",
        "Professional grade compound",
      ],
      specifications: {
        Material: "Ceramic composite",
        "Temperature Range": "-40°C to 650°C",
        Compatibility: "Universal fit",
        Warranty: "2 years",
      },
      images: [
        "bg-gradient-to-br from-purple-500 to-purple-700",
        "bg-gradient-to-br from-purple-400 to-purple-600",
        "bg-gradient-to-br from-purple-600 to-purple-800",
      ],
      inStock: true,
      stockCount: 15,
    },
    {
      id: "led-headlight-kit",
      name: "LED Headlight Kit",
      label: "PREMIUM",
      labelType: "premium",
      backgroundColor: "#facc15",
      category: "Lighting",
      title: "LED Headlight Kit",
      rating: 4.9,
      reviews: 267,
      price: 449.99,
      originalPrice: 499.99,
      discount: "10%",
      description:
        "High-brightness LED headlight kit for enhanced visibility and energy efficiency. Designed for easy installation and long-lasting performance.",
      features: [
        "Ultra-bright output",
        "Low power consumption",
        "Plug-and-play installation",
        "Waterproof and dustproof",
        "Long lifespan (30,000+ hrs)",
      ],
      specifications: {
        Voltage: "12V",
        Lumens: "8000lm",
        Compatibility: "Universal",
        Warranty: "1 year",
      },
      images: [
        "bg-gradient-to-br from-yellow-400 to-yellow-600",
        "bg-gradient-to-br from-yellow-300 to-yellow-500",
        "bg-gradient-to-br from-yellow-500 to-yellow-700",
      ],
      inStock: true,
      stockCount: 25,
    },
    {
      id: "coilover-kit",
      name: "Coilover Kit",
      label: "HOT",
      labelType: "sale",
      backgroundColor: "#f472b6",
      category: "Suspension",
      title: "Coilover Kit",
      rating: 4.7,
      reviews: 134,
      price: 299.99,
      originalPrice: 359.99,
      discount: "17%",
      description:
        "Adjustable coilover kit designed to improve handling and ride quality. Suitable for both street and track applications.",
      features: [
        "Ride height adjustability",
        "High-strength materials",
        "Improved cornering stability",
        "Corrosion-resistant finish",
        "Track-ready performance",
      ],
      specifications: {
        Material: "Aluminum & Steel",
        Adjustment: "Height & Preload",
        Compatibility: "Vehicle-specific",
        Warranty: "2 years",
      },
      images: [
        "bg-gradient-to-br from-pink-500 to-pink-700",
        "bg-gradient-to-br from-pink-400 to-pink-600",
        "bg-gradient-to-br from-pink-600 to-pink-800",
      ],
      inStock: true,
      stockCount: 10,
    },
    {
      id: "ecu-tuner",
      name: "ECU Tuner",
      label: "NEW",
      labelType: "premium",
      backgroundColor: "#60a5fa",
      category: "Electronics",
      title: "ECU Tuner",
      rating: 4.5,
      reviews: 89,
      price: 579.99,
      originalPrice: 649.99,
      discount: "11%",
      description:
        "Advanced ECU tuning device that allows customization of vehicle performance parameters. Unlock the true potential of your engine.",
      features: [
        "Real-time diagnostics",
        "Preloaded and custom maps",
        "Plug-and-play setup",
        "Improves fuel efficiency",
        "Boosts horsepower and torque",
      ],
      specifications: {
        Interface: "USB/OBD2",
        Compatibility: "Most cars 2008+",
        Updates: "Over-the-air",
        Warranty: "1 year",
      },
      images: [
        "bg-gradient-to-br from-blue-500 to-blue-700",
        "bg-gradient-to-br from-blue-400 to-blue-600",
        "bg-gradient-to-br from-blue-600 to-blue-800",
      ],
      inStock: true,
      stockCount: 8,
    },
  ],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    updateProduct: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
    },
  },
});

export default productSlice.reducer;
export const { updateProduct } = productSlice.actions;

export const selectAllProducts = (state: { product: ProductState }) =>
  state.product.products;

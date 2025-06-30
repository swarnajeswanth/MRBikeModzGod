import React from "react";
import ProductCard from "./IndividualProduct";
import "./productgrid.css";

const products = [
  {
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
  },
  {
    label: "PREMIUM",
    labelType: "premium",
    backgroundColor: "#facc15",
    category: "Lighting",
    title: "LED Headlight Kit",
    rating: 4.9,
    reviews: 267,
    price: 449.99,
  },
  {
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
  },
  {
    label: "NEW",
    labelType: "premium",
    backgroundColor: "#60a5fa",
    category: "Electronics",
    title: "ECU Tuner",
    rating: 4.5,
    reviews: 89,
    price: 579.99,
  },
];

const ProductGrid: React.FC = () => {
  return (
    <div className="product-grid ">
      {products.map((prod, index) => (
        <ProductCard key={index} {...prod} />
      ))}
    </div>
  );
};

export default ProductGrid;

"use client";
import React, { useState, useEffect, useRef } from "react";
import ProductCard from "../IndividualProduct";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./productgrid.css";

import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);
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

const ProductCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const prev = () => setActiveIndex((i) => Math.max(i - 1, 0));
  const next = () =>
    setActiveIndex((i) => Math.min(i + 1, products.length - 1));

  const CARD_WIDTH = 280;
  const GAP = 20;
  const totalSlideWidth = CARD_WIDTH + GAP;
  const centerOffset = (containerWidth - CARD_WIDTH) / 2;
  const x = centerOffset - activeIndex * totalSlideWidth;

  return (
    <div className="scroll-container" ref={containerRef}>
      <button
        className={`scroll-button left ${activeIndex === 0 ? "disabled" : ""}`}
        onClick={prev}
      >
        {" "}
        <ChevronLeft size={28} className="text-white" />{" "}
      </button>
      <div
        className="product-grid-scrollable"
        style={{ transform: `translateX(${x}px)` }}
      >
        {products.map((p, idx) => (
          <div
            key={idx}
            className={
              idx === activeIndex
                ? "card card-wrapper active"
                : "card card-wrapper"
            }
          >
            <ProductCard
              label={p.label}
              labelType={p.labelType}
              backgroundColor={p.backgroundColor}
              category={p.category}
              title={p.title}
              rating={p.rating}
              reviews={p.reviews}
              price={p.price}
              originalPrice={p.originalPrice}
              discount={p.discount}
            />
          </div>
        ))}
      </div>
      <button
        className={`scroll-button right ${
          activeIndex === products.length - 1 ? "disabled" : ""
        }`}
        onClick={next}
      >
        {" "}
        <ChevronRight size={28} className="text-white" />{" "}
      </button>
    </div>
  );
};

export default ProductCarousel;

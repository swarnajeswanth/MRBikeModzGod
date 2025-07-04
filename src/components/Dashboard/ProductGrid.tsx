"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../IndividualProduct";
import { ChevronLeft, ChevronRight, EyeOff } from "lucide-react";
import "./productgrid.css";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { selectAllProducts } from "@/components/store/productSlice";
import { selectFeatures } from "@/components/store/storeSettingsSlice";

gsap.registerPlugin(Draggable);

const ProductCarousel: React.FC = () => {
  const products = useSelector(selectAllProducts);
  const features = useSelector(selectFeatures);
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

  // Show disabled state if product display features are disabled
  if (!features?.productImages && !features?.productDetails) {
    return (
      <div className="scroll-container" ref={containerRef}>
        <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <EyeOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Product display is currently disabled
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              label={features?.discountDisplay ? p.label : ""}
              labelType={features?.discountDisplay ? p.labelType : ""}
              backgroundColor={p.backgroundColor}
              category={p.category}
              title={p.title}
              rating={features?.ratings ? p.rating : 0}
              reviews={features?.reviews ? p.reviews : 0}
              price={features?.priceDisplay ? p.price : 0}
              originalPrice={features?.priceDisplay ? p.originalPrice : 0}
              discount={features?.discountDisplay ? p.discount : ""}
              images={features?.productImages ? p.images : []}
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

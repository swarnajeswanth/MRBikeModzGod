"use client";

import React from "react";
import "./individualproduct.css";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AddToCartButton from "@/components/Cart/AddToCart"; // Adjust path if needed
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/components/store/LoadingSlice";
import { useTransition } from "react";

interface ProductCardProps {
  label?: string;
  labelType?: string;
  backgroundColor: string;
  category: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  discount?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  label,
  labelType,
  backgroundColor,
  category,
  title,
  rating,
  reviews,
  price,
  originalPrice,
  discount,
}) => {
  const [isPending, startTransition] = useTransition();

  const handleProductClick = (productId: string) => {
    dispatch(startLoading());
    startTransition(() => {
      router.push(`/product/${productId}`);
      // stopLoading should ideally happen after route load
      // but for now we simulate delay if needed
      setTimeout(() => {
        dispatch(stopLoading());
      }, 800); // adjust if your route loads slowly
    });
  };

  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div className="product-card">
      <div className="product-image" style={{ backgroundColor }}>
        {label && <div className={`label ${labelType}`}>{label}</div>}
        <span className="product-letter">{title.charAt(0)}</span>
      </div>

      <div className="product-info">
        <span className="category-tag">{category}</span>
        <h3
          style={{ cursor: "pointer" }}
          onClick={() => handleProductClick(title)}
        >
          {title}
        </h3>

        <div className="rating">
          <FaStar color="#FFD700" />
          <span>{rating}</span>
          <span className="reviews">({reviews} reviews)</span>
        </div>

        <div className="price-row">
          <span className="price">${price.toFixed(2)}</span>
          {originalPrice && (
            <>
              <span className="original-price">
                ${originalPrice.toFixed(2)}
              </span>
              {discount && (
                <span className="discount-badge">SAVE {discount}</span>
              )}
            </>
          )}
        </div>

        {/* Custom GSAP-powered Add to Cart Button */}
        <AddToCartButton />
      </div>
    </div>
  );
};

export default ProductCard;

"use client";

import React from "react";
import "./individualproduct.css";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AddToCartButton from "@/components/Cart/AddToCart"; // Adjust path if needed

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
  const router = useRouter();

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
          onClick={() => router.push(`/product/${title}`)}
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

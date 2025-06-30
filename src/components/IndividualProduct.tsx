import React from "react";
import "./individualproduct.css";
import { FaShoppingCart, FaStar } from "react-icons/fa";

interface ProductCardProps {
  label?: string;
  labelType?: "sale" | "premium";
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
  return (
    <div className="product-card">
      <div className="product-image" style={{ backgroundColor }}>
        {label && <div className={`label ${labelType}`}>{label}</div>}
        <span className="product-letter">{title.charAt(0)}</span>
      </div>
      <div className="product-info">
        <span className="category-tag">{category}</span>
        <h3>{title}</h3>
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
        <button className="add-to-cart">
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

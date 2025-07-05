"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../IndividualProduct";
import { ChevronLeft, ChevronRight, EyeOff } from "lucide-react";
import "./productgrid.css";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import {
  selectAllProducts,
  selectLoading,
} from "@/components/store/productSlice";
import { selectFeatures } from "@/components/store/storeSettingsSlice";
import { RootState } from "@/components/store";
import { toggleWishlist } from "@/components/store/UserSlice";
import { toast } from "react-hot-toast";
import { selectIsCustomerExperienceEnabled } from "@/components/store/storeSettingsSlice";

gsap.registerPlugin(Draggable);

const ProductCarousel: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectLoading);
  const { wishlist, isLoggedIn } = useSelector(
    (state: RootState) => state.user
  );
  const requireLoginForWishlist = useSelector(
    selectIsCustomerExperienceEnabled("requireLoginForWishlist")
  );
  const features = useSelector(selectFeatures);

  console.log("ProductGrid - products length:", products.length);
  console.log("ProductGrid - products:", products);
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

  const handleToggleWishlist = (product: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to product page

    // Check if login is required for wishlist and user is not logged in
    if (requireLoginForWishlist && !isLoggedIn) {
      toast.error("Please log in to use the wishlist.");
      router.push("/auth");
      return;
    }

    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image:
        product.images && product.images.length > 0 ? product.images[0] : "",
      category: product.category,
    };

    dispatch(toggleWishlist(wishlistItem));

    const isInWishlist = wishlist.some((item) => item.id === product.id);
    if (isInWishlist) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

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
              id={p.id}
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
              loading={loading}
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

"use client";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store";
import {
  selectIsFeatureEnabled,
  selectIsCustomerExperienceEnabled,
} from "@/components/store/storeSettingsSlice";
import { useCart } from "@/components/hooks/useCart";
import { useRouter } from "next/navigation";
import "./AddToCart.css";

interface AddToCartButtonProps {
  product?: any;
  className?: string;
}

const AddToCartButton = ({ product, className = "" }: AddToCartButtonProps) => {
  const { addItem, removeItem, isItemInCart } = useCart();
  const [buttonText, setButtonText] = useState("Add to cart");
  const [hasAdded, setHasAdded] = useState(false);
  const [showCross, setShowCross] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const shirtRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<SVGSVGElement>(null);
  const crossRef = useRef<SVGSVGElement>(null);
  const addTextRef = useRef<HTMLSpanElement>(null);
  const staticCartRef = useRef<SVGSVGElement>(null);

  const router = useRouter();
  const isAddToCartEnabled = useSelector(selectIsFeatureEnabled("addToCart"));
  const allowGuestBrowsing = useSelector(
    selectIsCustomerExperienceEnabled("allowGuestBrowsing")
  );
  const { isLoggedIn } = useSelector((state: RootState) => state.user);

  // Check if product is already in cart
  const isInCart = product ? isItemInCart(product.id) : false;

  // Initialize state based on cart state
  useEffect(() => {
    if (isInCart) {
      setButtonText("Added");
      setHasAdded(true);
      setShowCross(true);
      // Set initial states for already added items
      if (tickRef.current) gsap.set(tickRef.current, { opacity: 0 });
      if (crossRef.current) gsap.set(crossRef.current, { opacity: 1 });
      if (staticCartRef.current)
        gsap.set(staticCartRef.current, { opacity: 1 });
      if (addTextRef.current) gsap.set(addTextRef.current, { opacity: 1 });
      if (shirtRef.current) gsap.set(shirtRef.current, { opacity: 0 });
      if (cartRef.current) gsap.set(cartRef.current, { opacity: 0 });
    }
  }, [isInCart]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to product page

    if (!isAddToCartEnabled) {
      toast.error("Add to cart feature is currently disabled");
      return;
    }

    // Check if guest browsing is allowed or user is logged in
    if (!allowGuestBrowsing && !isLoggedIn) {
      toast.error("Please log in to add items to cart.");
      router.push("/auth");
      return;
    }

    if (hasAdded || isInCart || isLoading) return; // prevent re-animation if already added
    if (buttonText !== "Add to cart") return; // allow only if untouched

    setIsLoading(true);

    const button = buttonRef.current;
    const shirt = shirtRef.current;
    const cart = cartRef.current;
    const tick = tickRef.current;
    const cross = crossRef.current;
    const addText = addTextRef.current;
    const staticCart = staticCartRef.current;

    if (
      !button ||
      !shirt ||
      !cart ||
      !tick ||
      !cross ||
      !addText ||
      !staticCart
    ) {
      setIsLoading(false);
      return;
    }

    // Add active class to button
    button.classList.add("active");

    // Hide static elements
    gsap.set(staticCart, { opacity: 0 });
    gsap.set(addText, { opacity: 0 });

    // Show animated elements
    gsap.set([shirt, cart], { opacity: 1 });

    // Create timeline for better animation control
    const tl = gsap.timeline({
      onComplete: () => {
        // Animation complete - add to cart
        handleCartAddition();
      },
    });

    // Animate shirt flying to cart
    tl.fromTo(
      shirt,
      {
        y: -20,
        scale: 1,
        opacity: 1,
        x: 0,
      },
      {
        y: 10,
        scale: 0.3,
        opacity: 0,
        x: 50,
        duration: 0.8,
        ease: "power2.inOut",
      }
    );

    // Animate cart movement
    tl.fromTo(
      cart,
      {
        x: 0,
        scale: 1,
        rotate: 0,
        opacity: 1,
      },
      {
        x: 50,
        scale: 1.2,
        rotate: -10,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.4"
    );

    // Return cart to position and show tick
    tl.to(cart, {
      x: 0,
      scale: 1,
      rotate: 0,
      duration: 0.3,
      ease: "back.out(1.7)",
    });

    // Show tick
    tl.set(tick, { opacity: 1 }, "-=0.1");
    tl.fromTo(
      tick,
      {
        scale: 0,
        opacity: 1,
      },
      {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
      }
    );

    // Hide animated elements and show static ones
    tl.set([shirt, cart], { opacity: 0 });
    tl.set(staticCart, { opacity: 1 });
    tl.to(addText, {
      opacity: 1,
      duration: 0.3,
      onStart: () => {
        setButtonText("Added");
        setHasAdded(true);
        button.classList.remove("active");
      },
    });

    // Show cross after 2 seconds
    tl.to(
      {},
      {
        duration: 2,
        onComplete: () => {
          gsap.set(tick, { opacity: 0 });
          gsap.set(cross, { opacity: 1 });
          setShowCross(true);
        },
      }
    );
  };

  const handleCartAddition = async () => {
    // Add product to cart via Redux
    if (product) {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image:
          (product.images && product.images.length > 0 && product.images[0]) ||
          product.image ||
          "",
        category: product.category,
        originalPrice: product.originalPrice,
        discount: product.discount,
      };

      await addItem(cartItem);
    }

    toast.success(
      product ? `${product.name} added to cart!` : "Product added to cart!"
    );

    setIsLoading(false);
  };

  const handleReset = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to product page

    // Remove item from cart if it exists
    if (product && isInCart) {
      await removeItem(product.id);
    }

    setButtonText("Add to cart");
    setHasAdded(false);
    setShowCross(false);
    setIsLoading(false);

    // Reset visuals
    if (tickRef.current) gsap.set(tickRef.current, { opacity: 0 });
    if (crossRef.current) gsap.set(crossRef.current, { opacity: 0 });
    if (staticCartRef.current) gsap.set(staticCartRef.current, { opacity: 1 });
    if (addTextRef.current) gsap.set(addTextRef.current, { opacity: 1 });
    if (shirtRef.current) gsap.set(shirtRef.current, { opacity: 0 });
    if (cartRef.current) gsap.set(cartRef.current, { opacity: 0 });
  };

  // Show disabled state if add to cart feature is disabled
  if (!isAddToCartEnabled) {
    return (
      <button
        disabled
        className={`bg-gray-400 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
        title="Add to cart feature is disabled"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 6h15l-1.5 9h-13z" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
        Add to Cart (Disabled)
      </button>
    );
  }

  // Show login required message if guest browsing is disabled and user is not logged in
  if (!allowGuestBrowsing && !isLoggedIn) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent navigation to product page
          toast.error("Please log in to add items to cart.");
          router.push("/auth");
        }}
        className={`bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${className}`}
        title="Login required to add to cart"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 6h15l-1.5 9h-13z" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
        Login to Add to Cart
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`add-to-cart relative w-full py-3 rounded bg-[#8e0005] text-white font-semibold text-sm overflow-hidden flex items-center justify-center gap-2 ${className}`}
    >
      {/* Static Cart Icon */}
      <svg
        ref={staticCartRef}
        className="w-5 h-5 text-white transition-opacity duration-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 6h15l-1.5 9h-13z" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>

      {/* Button Text */}
      <span ref={addTextRef} className="z-10 relative pointer-events-none">
        {isLoading ? "Adding..." : buttonText}
      </span>

      {/* Shirt Icon */}
      <div
        ref={shirtRef}
        className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 z-10"
      >
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M4.99997 3L8.99997 1.5C8.99997 1.5 10.6901 3 12 3C13.3098 3 15 1.5 15 1.5L19 3L23.5 8L20.5 11L19 9.5L18 22.5C18 22.5 14 21.5 12 21.5C10 21.5 5.99997 22.5 5.99997 22.5L4.99997 9.5L3.5 11L0.5 8L4.99997 3Z" />
        </svg>
      </div>

      {/* Animated Cart */}
      <div
        ref={cartRef}
        className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 z-10"
      >
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 6h15l-1.5 9h-13z" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
      </div>

      {/* Tick */}
      <svg
        ref={tickRef}
        className={`absolute right-2 top-2 w-5 h-5 text-white opacity-0 pointer-events-none ${
          showCross ? "hidden" : ""
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>

      {/* Cross */}
      <div
        className={`absolute right-2 top-2 w-5 h-5 z-20 cursor-pointer ${
          showCross ? "" : "hidden"
        }`}
        onClick={handleReset}
      >
        <svg
          ref={crossRef}
          className="w-5 h-5 text-white pointer-events-auto"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </div>
    </button>
  );
};

export default AddToCartButton;

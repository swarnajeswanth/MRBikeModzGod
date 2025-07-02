"use client";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

export default function AddToCartButton() {
  const [buttonText, setButtonText] = useState("Add to cart");
  const [hasAdded, setHasAdded] = useState(false);
  const [showCross, setShowCross] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const shirtRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const tickRef = useRef<SVGSVGElement>(null);
  const crossRef = useRef<SVGSVGElement>(null);
  const shirtPathRef = useRef<SVGPathElement>(null);
  const addTextRef = useRef<HTMLSpanElement>(null);
  const staticCartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const storedState = localStorage.getItem("added-to-cart");
    if (storedState === "true") {
      setButtonText("Added");
      setHasAdded(true);
      setShowCross(true);

      gsap.set(tickRef.current, { opacity: 0 });
      gsap.set(crossRef.current, { opacity: 1 });
      gsap.set(staticCartRef.current, { opacity: 1 });
      gsap.set(addTextRef.current, { opacity: 1 });
      gsap.set([shirtRef.current, cartRef.current], { opacity: 0 });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("added-to-cart", String(hasAdded));
  }, [hasAdded]);

  const handleClick = () => {
    if (hasAdded) return; // prevent re-animation
    if (buttonText !== "Add to cart") return; // allow only if untouched

    const button = buttonRef.current;
    const shirt = shirtRef.current;
    const cart = cartRef.current;
    const tick = tickRef.current;
    const cross = crossRef.current;
    const shirtPath = shirtPathRef.current;
    const addText = addTextRef.current;
    const staticCart = staticCartRef.current;

    if (
      !button ||
      !shirt ||
      !cart ||
      !tick ||
      !cross ||
      !shirtPath ||
      !addText ||
      !staticCart
    )
      return;

    button.classList.add("active");

    gsap.set(staticCart, { opacity: 0 });
    gsap.set(addText, { opacity: 0 });
    gsap.set([shirt, cart], { opacity: 1 });

    // Animate shirt
    gsap.fromTo(
      shirt,
      { y: -42, scale: 1, opacity: 1 },
      {
        y: 20,
        scale: 0.3,
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
      }
    );

    gsap.to(shirtPath, {
      keyframes: [
        {
          morphSVG:
            "M4.99997 3L8.99997 1.5C8.99997 1.5 10.6901 3 12 3C13.3098 3 15 1.5 15 1.5L19 3L23.5 8L20.5 11L19 9.5L18 22.5C18 22.5 14 21.5 12 21.5C10 21.5 5.99997 22.5 5.99997 22.5L4.99997 9.5L3.5 11L0.5 8L4.99997 3Z",
          duration: 0.25,
          delay: 0.25,
        },
        {
          morphSVG:
            "M4.99997 3L8.99997 1.5C8.99997 1.5 10.6901 3 12 3C13.3098 3 15 1.5 15 1.5L19 3L23.5 8L20.5 11L19 9.5L18.5 22.5C18.5 22.5 13.5 22.5 12 22.5C10.5 22.5 5.5 22.5 5.5 22.5L4.99997 9.5L3.5 11L0.5 8L4.99997 3Z",
          duration: 0.85,
          ease: "elastic.out(1, .5)",
        },
      ],
    });

    // Animate cart and tick
    gsap.fromTo(
      cart,
      { x: 0, scale: 1, rotate: 0 },
      {
        keyframes: [
          { x: 52, rotate: -15, duration: 0.2 },
          { x: 104, rotate: 0, duration: 0.2 },
          {
            x: -104,
            duration: 0,
            onComplete: () => gsap.set(tick, { opacity: 1 }),
          },
          {
            x: -48,
            scale: 0.75,
            duration: 0.25,
            onComplete: () => {
              button.classList.remove("active");
              gsap.set([shirt, cart], { opacity: 0 });
              gsap.set(staticCart, { opacity: 1 });

              gsap.to(addText, {
                opacity: 1,
                duration: 0.3,
                onStart: () => {
                  setButtonText("Added");
                  setHasAdded(true);
                },
              });

              // Show cross after 2s
              setTimeout(() => {
                gsap.set(tick, { opacity: 0 });
                gsap.set(cross, { opacity: 1 });
                setShowCross(true);
              }, 2000);
            },
          },
        ],
        delay: 1.0,
      }
    );

    gsap.fromTo(
      tick,
      { y: -10, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        delay: 1.4,
        ease: "back.out(1.7)",
      }
    );
  };
  const handleReset = () => {
    setButtonText("Add to cart");
    setHasAdded(false);
    setShowCross(false);

    // Reset visuals
    gsap.set(tickRef.current, { opacity: 0 });
    gsap.set(crossRef.current, { opacity: 0 });
    gsap.set(staticCartRef.current, { opacity: 1 });
    gsap.set(addTextRef.current, { opacity: 1 });
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="add-to-cart relative w-44 py-3 rounded bg-white text-black font-semibold text-sm overflow-hidden flex items-center justify-center gap-2"
    >
      {/* Static Cart Icon */}
      <svg
        ref={staticCartRef}
        className="w-5 h-5 text-black transition-opacity duration-300"
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
        {buttonText}
      </span>

      {/* Shirt */}
      <div
        ref={shirtRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 z-10"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#000">
          <path
            ref={shirtPathRef}
            d="M4.99997 3L8.99997 1.5C8.99997 1.5 10.6901 3 12 3C13.3098 3 15 1.5 15 1.5L19 3L23.5 8L20.5 11L19 9.5L18 22.5C18 22.5 14 21.5 12 21.5C10 21.5 5.99997 22.5 5.99997 22.5L4.99997 9.5L3.5 11L0.5 8L4.99997 3Z"
          />
        </svg>
      </div>

      {/* Animated Cart */}
      <div
        ref={cartRef}
        className="absolute top-2 left-1/2 pointer-events-none opacity-0 z-10"
        style={{
          transform: "translate(-50%, 0)",
          transformOrigin: "center",
        }}
      >
        <svg
          className="w-6 h-6 text-black"
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
}

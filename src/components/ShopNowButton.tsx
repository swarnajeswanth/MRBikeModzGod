"use client";
import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";

const ShopNowButton = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      gsap.to(el, {
        scale: 1.1,
        duration: 0.8,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }, []);

  return (
    <button className="bg-red-600 hover:bg-red-700 flex items-center text-white px-8 py-3 text-lg font-semibold">
      <span ref={textRef}>Shop Now</span>
      <span className="p-5">
        <ArrowRight className="ml-2 h-10 w-10 animate-ping" />
      </span>
    </button>
  );
};

export default ShopNowButton;

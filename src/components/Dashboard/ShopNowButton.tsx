"use client";
import React, { useEffect, useRef, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/components/store/LoadingSlice"; // ✅ Adjust if needed

const ShopNowButton = () => {
  const textRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        scale: 1.1,
        duration: 0.8,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }, []);

  const handleAllClick = () => {
    dispatch(startLoading());

    startTransition(() => {
      router.push("/product/allproducts");

      // Simulate load end — ideally triggered after route completes
      setTimeout(() => {
        dispatch(stopLoading());
      }, 800); // ⏱ Adjust based on perceived route delay
    });
  };

  return (
    <button
      onClick={handleAllClick}
      className="bg-red-600 hover:bg-red-700 flex items-center text-white px-8 py-3 text-lg font-semibold"
    >
      <span ref={textRef}>Shop Now</span>
      <span className="p-5">
        <ArrowRight className="ml-2 h-10 w-10 animate-ping" />
      </span>
    </button>
  );
};

export default ShopNowButton;

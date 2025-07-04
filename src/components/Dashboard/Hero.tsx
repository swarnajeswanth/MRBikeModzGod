"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Zap } from "lucide-react";
import ShopNowButton from "./ShopNowButton";
import Headline from "./HeadLine";

const Hero = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    // Animate left content
    gsap.fromTo(
      leftRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

    // Animate container on right
    gsap.fromTo(
      rightRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
    );

    if (isMobile) {
      // Mobile: Cards come from left with scale and stagger
      gsap.fromTo(
        cardsRef.current,
        { x: -50, scale: 0, opacity: 0 },
        {
          x: 0,
          scale: 1,
          opacity: 1,
          stagger: 0.2,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.5,
        }
      );
    } else {
      // Desktop: Only scale + fade stagger
      gsap.fromTo(
        cardsRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.5,
        }
      );
    }
  }, []);

  return (
    <section className="relative overflow-hidden py-5 lg:py-32 h-full">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-500/10 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT Side */}
          <div className="space-y-8" ref={leftRef}>
            <div className="space-y-4">
              <div className="inline-flex items-center bg-red-600/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                <Zap className="h-4 w-4 mr-2" />
                Premium Auto Performance Parts
              </div>

              <Headline />

              <p className="text-xl text-gray-300 max-w-lg">
                Discover premium auto spare parts and accessories that deliver
                unmatched performance, style, and reliability for your vehicle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <ShopNowButton />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-gray-400">Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-gray-400">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">15+</div>
                <div className="text-gray-400">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <SliderManager
        images={sliderImages}
        onImagesChange={setSliderImages}
        onClose={() => setShowSlider(false)}
      /> */}
    </section>
  );
};

export default Hero;

"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Zap } from "lucide-react";
import ShopNowButton from "./ShopNowButton";
import Headline from "./HeadLine";
import ImageSlider from "../ImageSlider/ImageSlider";
import HeroSliderShimmer from "../Loaders/HeroSliderShimmer";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSliderLoading,
  selectSliderImages,
  fetchSliderImages,
} from "../store/sliderSlice";
import { AppDispatch } from "../store";

const Hero = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const sliderLoading = useSelector(selectSliderLoading);
  const sliderImages = useSelector(selectSliderImages);
  const [hasTriedSeeding, setHasTriedSeeding] = useState(false);

  // Fetch slider images on component mount
  useEffect(() => {
    if (sliderImages.length === 0 && !hasTriedSeeding) {
      dispatch(fetchSliderImages());
      setHasTriedSeeding(true);
    }
  }, [dispatch, sliderImages.length, hasTriedSeeding]);

  // Auto-seed default images if none exist after loading
  useEffect(() => {
    const seedDefaultImages = async () => {
      if (!sliderLoading && sliderImages.length === 0 && hasTriedSeeding) {
        try {
          const response = await fetch("/api/slider/seed", {
            method: "POST",
          });
          const result = await response.json();
          if (result.success) {
            // Refetch images after seeding
            dispatch(fetchSliderImages());
          }
        } catch (error) {
          console.error("Failed to seed default slider images:", error);
        }
      }
    };

    seedDefaultImages();
  }, [sliderLoading, sliderImages.length, hasTriedSeeding, dispatch]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    // Animate slider content
    gsap.fromTo(
      leftRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

    // Animate content below slider
    gsap.fromTo(
      rightRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.3 }
    );

    if (isMobile) {
      // Mobile: Cards come from bottom with scale and stagger
      gsap.fromTo(
        cardsRef.current,
        { y: 50, scale: 0, opacity: 0 },
        {
          y: 0,
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
    <section className="relative overflow-hidden min-h-screen flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-600/20 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-500/10 to-transparent"></div>

      <div className="relative flex-1 flex flex-col">
        {/* TOP - Slider Section */}
        <div
          className="flex-1 flex items-center justify-center py-2 lg:py-4"
          ref={leftRef}
        >
          {sliderLoading ? (
            <div className="w-full max-w-6xl   ">
              <HeroSliderShimmer />
            </div>
          ) : (
            <div className="w-full  mx-auto ">
              <ImageSlider
                images={sliderImages}
                className="h-[60vh] min-h-[400px] "
              />
            </div>
          )}
        </div>

        {/* BOTTOM - Content Section */}
        <div className="flex-shrink-0 py-8" ref={rightRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              {/* Headline and Description */}
              {/* <div className="space-y-4">
                <div className="inline-flex items-center bg-red-600/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium animate-pulse">
                  <Zap className="h-4 w-4 mr-2" />
                  Premium Auto Performance Parts
                </div>

                <Headline />

                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Discover premium auto spare parts and accessories that deliver
                  unmatched performance, style, and reliability for your
                  vehicle.
                </p>
              </div> */}

              {/* Shop Now Button */}
              <div className="flex justify-center">
                <ShopNowButton />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800 max-w-2xl mx-auto">
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
      </div>
    </section>
  );
};

export default Hero;

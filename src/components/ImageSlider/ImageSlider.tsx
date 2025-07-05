"use client";

import React, { useRef, useState, useEffect } from "react";
import { Dot, ChevronLeft, ChevronRight, Image } from "lucide-react";

interface SlideImage {
  id: string;
  url: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageSliderProps {
  images: SlideImage[];
  className?: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  className = "",
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollTo = (index: number) => {
    const container = scrollRef.current;
    const child = container?.children[index] as HTMLElement;
    if (container && child) {
      container.scrollTo({
        left: child.offsetLeft,
        behavior: "smooth",
      });
      setCurrentSlide(index);
    }
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const itemWidth = container.scrollWidth / images.length;
    const currentIndex = Math.round(scrollLeft / itemWidth);
    setCurrentSlide(currentIndex);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [images.length]);

  // Auto-advance slides
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
      scrollTo((currentSlide + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, images.length]);

  const nextSlide = () => {
    const next = (currentSlide + 1) % images.length;
    scrollTo(next);
  };

  const prevSlide = () => {
    const prev = (currentSlide - 1 + images.length) % images.length;
    scrollTo(prev);
  };

  // Show placeholder when no images
  if (images.length === 0) {
    return (
      <div
        className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No slider images available</p>
          <p className="text-gray-500 text-sm mt-2">
            Add images through the retailer dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Main Slider Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory h-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="flex-shrink-0 w-full h-full snap-start relative"
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover absolute inset-0"
            />
            {/* Overlay with content */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white px-6 max-w-4xl">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 leading-tight">
                  {image.title || image.alt}
                </h2>
                {image.description && (
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                    {image.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? "bg-red-500 scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Mobile swipe indicator */}
      <div className="absolute bottom-4 left-4 text-white/70 text-sm hidden md:block">
        <span className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Swipe to navigate
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
};

export default ImageSlider;

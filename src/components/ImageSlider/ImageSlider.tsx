"use client";

import React, { useRef, useState, useEffect } from "react";
import { Dot, ChevronLeft, ChevronRight } from "lucide-react";

interface SlideImage {
  id: string;
  url: string;
  alt: string;
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
    }
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const children = Array.from(container.children) as HTMLElement[];
    const scrollLeft = container.scrollLeft;
    const widths = children.map((child) => child.offsetLeft);

    const index = widths.findIndex((offset, i) => {
      const nextOffset = widths[i + 1] ?? Infinity;
      return scrollLeft >= offset && scrollLeft < nextOffset;
    });

    if (index !== -1) {
      setCurrentSlide(index);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  if (images.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-xl p-8 text-center ${className}`}>
        <div className="text-4xl mb-4">📷</div>
        <p className="text-gray-400">No images to display</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Image container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory rounded-xl"
      >
        {images.map((image) => (
          <div key={image.id} className="flex-shrink-0 snap-center w-full">
            <img
              src={`https://images.unsplash.com/${image.url}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`}
              alt={image.alt}
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => scrollTo(Math.max(currentSlide - 1, 0))}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full text-white hover:bg-white/30 z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              scrollTo(Math.min(currentSlide + 1, images.length - 1))
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full text-white hover:bg-white/30 z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className="group"
              aria-label={`Go to slide ${index + 1}`}
            >
              <Dot
                className={`w-3 h-3 transition-colors duration-200 ${
                  index === currentSlide
                    ? "text-red-500"
                    : "text-gray-400 group-hover:text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;

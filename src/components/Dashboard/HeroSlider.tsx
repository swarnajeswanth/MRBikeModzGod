"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSliderImages,
  fetchSliderImages,
} from "@/components/store/sliderSlice";

interface SlideImage {
  id: string;
  url: string;
  alt: string;
  title?: string;
  description?: string;
}

interface HeroSliderProps {
  images?: SlideImage[];
  autoSlideInterval?: number;
  className?: string;
}

const HeroSlider: React.FC<HeroSliderProps> = ({
  images: propImages = [],
  autoSlideInterval = 5000,
  className = "",
}) => {
  const dispatch = useDispatch();
  const storeImages = useSelector(selectSliderImages);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Default images for fallback
  const defaultImages: SlideImage[] = [
    {
      id: "default-1",
      url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Premium Auto Parts Display",
      title: "Premium Auto Parts",
      description: "High-quality parts for your vehicle",
    },
    {
      id: "default-2",
      url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Car Electronics",
      title: "Latest Car Electronics",
      description: "Advanced technology for modern vehicles",
    },
    {
      id: "default-3",
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      alt: "Performance Components",
      title: "Performance Components",
      description: "Upgrade your vehicle's performance",
    },
  ];

  // Use store images if available, otherwise use prop images, or default images
  const images =
    storeImages.length > 0
      ? storeImages
      : propImages?.length
      ? propImages
      : defaultImages;

  // Fetch images on component mount
  useEffect(() => {
    if (storeImages.length === 0) {
      dispatch(fetchSliderImages() as any);
    }
  }, [dispatch, storeImages.length]);

  // Navigation functions
  const nextSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      setCurrentSlide(index % images.length);
    },
    [images.length]
  );

  // Auto-slide functionality
  useEffect(() => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
    if (!isDraggingRef.current && images.length > 1) {
      autoSlideRef.current = setInterval(nextSlide, autoSlideInterval);
    }
    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
        autoSlideRef.current = null;
      }
    };
  }, [nextSlide, autoSlideInterval, images.length]);

  // Pause auto-slide on hover (desktop)
  const handleMouseEnter = useCallback(() => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  // Resume auto-slide after 2s of no interaction
  const handleMouseLeave = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    resumeTimeoutRef.current = setTimeout(() => {
      if (!isDraggingRef.current && images.length > 1) {
        if (autoSlideRef.current) clearInterval(autoSlideRef.current);
        autoSlideRef.current = setInterval(nextSlide, autoSlideInterval);
      }
    }, 2000);
  }, [autoSlideInterval, images.length, nextSlide]);

  // Mouse drag functionality (desktop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    setDragStartX(e.clientX);
    setDragOffset(0);
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      setDragOffset(deltaX);
    },
    [isDragging, dragStartX]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    isDraggingRef.current = false;
    const threshold = 100;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    setDragOffset(0);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    resumeTimeoutRef.current = setTimeout(() => {
      if (!isDraggingRef.current && images.length > 1) {
        if (autoSlideRef.current) clearInterval(autoSlideRef.current);
        autoSlideRef.current = setInterval(nextSlide, autoSlideInterval);
      }
    }, 2000);
  }, [
    isDragging,
    dragOffset,
    prevSlide,
    nextSlide,
    autoSlideInterval,
    images.length,
    nextSlide,
  ]);

  // Touch events for mobile (improved drag detection)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    isDraggingRef.current = true;
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const deltaX = e.touches[0].clientX - dragStartX;
      setDragOffset(deltaX);
    },
    [isDragging, dragStartX]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    isDraggingRef.current = false;
    const threshold = 30;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    setDragOffset(0);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    resumeTimeoutRef.current = setTimeout(() => {
      if (!isDraggingRef.current && images.length > 1) {
        if (autoSlideRef.current) clearInterval(autoSlideRef.current);
        autoSlideRef.current = setInterval(nextSlide, autoSlideInterval);
      }
    }, 2000);
  }, [
    isDragging,
    dragOffset,
    prevSlide,
    nextSlide,
    autoSlideInterval,
    images.length,
    nextSlide,
  ]);

  // Early return for empty state
  if (images.length === 0) {
    return (
      <div
        className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center  ${className}`}
      >
        <div className="text-4xl mb-4">📷</div>
        <p className="text-gray-400">No images to display</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="relative w-full h-96 md:h-[500px] lg:h-[600px] select-none touch-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        {/* Images */}
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-transform duration-500 ease-out ${
              index === currentSlide
                ? "translate-x-0"
                : index < currentSlide
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
            style={{
              transform:
                index === currentSlide && isDragging
                  ? `translateX(${dragOffset}px)`
                  : undefined,
            }}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />

            {/* Overlay with content */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white px-6">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {image.title || image.alt}
                </h2>
                {image.description && (
                  <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                    {image.description}
                  </p>
                )}
                {/* Mobile drag hint */}
                <div className="block md:hidden mt-4 text-sm text-gray-300">
                  ← Swipe to navigate →
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
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
    </div>
  );
};

export default HeroSlider;

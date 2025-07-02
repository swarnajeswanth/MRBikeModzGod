// components/PageContentTransition.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PageTransitionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center  px-4">
      <div
        ref={contentRef}
        className="w-full max-w-6xl bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-500 origin-center"
      >
        {children}
      </div>
    </div>
  );
}

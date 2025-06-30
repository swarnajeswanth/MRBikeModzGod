"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./headline.css";

const Headline = () => {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chars = headingRef.current?.querySelectorAll(".char");
    if (chars) {
      gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 }).fromTo(
        chars,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power3.out",
          duration: 0.4,
          delay: 1,
        }
      );
    }
  }, []);

  const wrapChars = (text: string, keyPrefix = "") =>
    text.split("").map((char, i) => (
      <span key={`${keyPrefix}-${i}`} className="char">
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <div ref={headingRef}>
      <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
        {wrapChars("Upgrade Your", "upgrade")}
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">
          {wrapChars("Ride Today", "ride")}
        </span>
      </h1>
    </div>
  );
};

export default Headline;

"use client";

import React, { useState } from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import "./SocialMediaIcons.css";

interface SocialMediaIconProps {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  hoverColor: string;
  platform: string;
  size?: "sm" | "md" | "lg";
}

const SocialMediaIcon: React.FC<SocialMediaIconProps> = ({
  icon: Icon,
  href,
  color,
  hoverColor,
  platform,
  size = "md",
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Start animation
    setIsAnimating(true);

    // After animation completes, navigate to the social media page
    setTimeout(() => {
      window.open(href, "_blank", "noopener,noreferrer");
      setIsAnimating(false);
    }, 800); // Increased duration for smoother transition
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="relative">
      <a
        href={href}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative inline-block transition-all duration-500 ease-out ${
          isAnimating
            ? "scale-200 opacity-0 transform rotate-45 translate-y-[-20px] social-click"
            : "scale-100 opacity-100 transform rotate-0 translate-y-0"
        } ${color} ${hoverColor} hover:scale-125 cursor-pointer`}
        aria-label={`Follow us on ${platform}`}
      >
        <Icon className={`${sizeClasses[size]} transition-all duration-300`} />

        {/* Ripple effect */}
        {isAnimating && (
          <>
            <div className="absolute inset-0 bg-current opacity-30 rounded-full animate-ping" />
            <div className="absolute inset-0 bg-current opacity-20 rounded-full animate-pulse" />
          </>
        )}

        {/* Glow effect on hover */}
        <div
          className={`absolute inset-0 bg-current rounded-full transition-all duration-300 blur-sm ${
            isHovered ? "opacity-20 scale-150" : "opacity-0 scale-100"
          }`}
        />

        {/* Particle effect on click */}
        {isAnimating && (
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-current rounded-full animate-ping"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) rotate(${
                    i * 60
                  }deg) translateY(-20px)`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        )}
      </a>

      {/* Tooltip */}
      <div
        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 transition-opacity duration-200 pointer-events-none ${
          isHovered ? "opacity-100" : ""
        }`}
      >
        {platform}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

interface SocialMediaIconsProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "glowing" | "floating";
}

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({
  className = "",
  size = "md",
  variant = "default",
}) => {
  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/share/1HUtQoEnwq/",
      color: "text-gray-400",
      hoverColor: "hover:text-blue-400",
      platform: "Facebook",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/mrbikemodz?igsh=d250Ym1tb3NtcDZw",
      color: "text-gray-400",
      hoverColor: "hover:text-pink-400",
      platform: "Instagram",
    },
    {
      icon: Youtube,
      href: "https://www.youtube.com/@mrbikemodz",
      color: "text-gray-400",
      hoverColor: "hover:text-red-400",
      platform: "YouTube",
    },
  ];

  const variantClasses = {
    default: "space-x-4",
    minimal: "space-x-2",
    glowing: "space-x-4",
    floating: "space-x-4",
  };

  const containerClasses = {
    default: "",
    minimal: "",
    glowing: "",
    floating: "animate-bounce",
  };

  return (
    <div
      className={`flex items-center ${variantClasses[variant]} ${containerClasses[variant]} ${className}`}
    >
      {socialLinks.map((social, index) => (
        <div
          key={index}
          className={`transition-all duration-300 ${
            variant === "floating"
              ? `social-float social-stagger-${index + 1}`
              : variant === "glowing"
              ? "social-hover-glow"
              : variant === "minimal"
              ? "social-fade-in"
              : ""
          }`}
          style={{
            animationDelay: variant === "floating" ? `${index * 200}ms` : "0ms",
          }}
        >
          <SocialMediaIcon
            icon={social.icon}
            href={social.href}
            color={social.color}
            hoverColor={social.hoverColor}
            platform={social.platform}
            size={size}
          />
        </div>
      ))}
    </div>
  );
};

export default SocialMediaIcons;

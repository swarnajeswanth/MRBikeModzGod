"use client";

import React from "react";

// Animated Home Icon
export const AnimatedHomeIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4 mr-2",
}) => (
  <div className={`${className} relative`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-pulse"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
    <div className="absolute inset-0 bg-current opacity-20 animate-ping rounded-full"></div>
  </div>
);

// Animated Shopping Cart Icon
export const AnimatedCartIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4 mr-2",
}) => (
  <div className={`${className} relative`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-bounce"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
  </div>
);

// Animated List Icon
export const AnimatedListIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4 mr-2",
}) => (
  <div className={`${className} relative`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-pulse"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 animate-pulse"></div>
  </div>
);

// Animated Map Pin Icon
export const AnimatedMapPinIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4 mr-2",
}) => (
  <div className={`${className} relative`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-bounce"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
    <div className="absolute inset-0 bg-red-500 opacity-20 rounded-full animate-ping"></div>
  </div>
);

// Animated Info Icon
export const AnimatedInfoIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4 mr-2",
}) => (
  <div className={`${className} relative`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-pulse"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
    <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-full animate-ping"></div>
  </div>
);

// Animated Mail Icon
export const AnimatedMailIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4 mr-2",
}) => (
  <div className={`${className} relative`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-bounce"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
    <div className="absolute inset-0 bg-green-500 opacity-20 rounded-full animate-ping"></div>
  </div>
);

// Animated User Icon
export const AnimatedUserIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4 mr-2",
}) => (
  <div className={`${className} relative`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-pulse"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
    <div className="absolute inset-0 bg-purple-500 opacity-20 rounded-full animate-ping"></div>
  </div>
);

// Animated Log In Icon
export const AnimatedLogInIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4 mr-2",
}) => (
  <div className={`${className} relative`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-pulse"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10,17 15,12 10,7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
    <div className="absolute inset-0 bg-green-500 opacity-20 rounded-full animate-ping"></div>
  </div>
);

// Animated Log Out Icon
export const AnimatedLogOutIcon: React.FC<{ className?: string }> = ({
  className = "h-4 w-4 mr-2",
}) => (
  <div className={`${className} relative`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-pulse"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
    <div className="absolute inset-0 bg-red-500 opacity-20 rounded-full animate-ping"></div>
  </div>
);

// Animated Heart Icon (for wishlist)
export const AnimatedHeartIcon: React.FC<{
  className?: string;
  filled?: boolean;
}> = ({ className = "h-5 w-5", filled = false }) => (
  <div className={`${className} relative`}>
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={filled ? "animate-pulse" : "animate-bounce"}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
    {filled && (
      <div className="absolute inset-0 bg-red-500 opacity-20 rounded-full animate-ping"></div>
    )}
  </div>
);

// Animated Shopping Cart Icon (for cart)
export const AnimatedShoppingCartIcon: React.FC<{ className?: string }> = ({
  className = "h-5 w-5",
}) => (
  <div className={`${className} relative`}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-bounce"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
    <div className="absolute inset-0 bg-red-500 opacity-20 rounded-full animate-ping"></div>
  </div>
);

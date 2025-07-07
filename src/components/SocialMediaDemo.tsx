"use client";

import React from "react";
import SocialMediaIcons from "./SocialMediaIcons";

const SocialMediaDemo: React.FC = () => {
  return (
    <div className="bg-black text-white p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Social Media Icons Demo
        </h1>

        <div className="space-y-12">
          {/* Default Variant */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">
              Default Variant
            </h2>
            <p className="text-gray-400 mb-4">
              Standard social media icons with hover effects and click
              animations.
            </p>
            <div className="flex justify-center">
              <SocialMediaIcons
                variant="default"
                size="md"
                className="text-gray-400"
              />
            </div>
          </div>

          {/* Minimal Variant */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">
              Minimal Variant
            </h2>
            <p className="text-gray-400 mb-4">
              Compact spacing with subtle animations.
            </p>
            <div className="flex justify-center">
              <SocialMediaIcons
                variant="minimal"
                size="sm"
                className="text-gray-400"
              />
            </div>
          </div>

          {/* Glowing Variant */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">
              Glowing Variant
            </h2>
            <p className="text-gray-400 mb-4">
              Enhanced glow effects and pulse animations on hover.
            </p>
            <div className="flex justify-center">
              <SocialMediaIcons
                variant="glowing"
                size="lg"
                className="text-gray-400"
              />
            </div>
          </div>

          {/* Floating Variant */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">
              Floating Variant
            </h2>
            <p className="text-gray-400 mb-4">
              Continuous floating animation with staggered timing.
            </p>
            <div className="flex justify-center">
              <SocialMediaIcons
                variant="floating"
                size="md"
                className="text-gray-400"
              />
            </div>
          </div>

          {/* Different Sizes */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">
              Different Sizes
            </h2>
            <p className="text-gray-400 mb-4">
              Small, Medium, and Large sizes available.
            </p>
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 w-16">Small:</span>
                <SocialMediaIcons
                  variant="default"
                  size="sm"
                  className="text-gray-400"
                />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 w-16">Medium:</span>
                <SocialMediaIcons
                  variant="default"
                  size="md"
                  className="text-gray-400"
                />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 w-16">Large:</span>
                <SocialMediaIcons
                  variant="default"
                  size="lg"
                  className="text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">
              Features
            </h2>
            <ul className="text-gray-400 space-y-2">
              <li>
                • <strong>Click Animation:</strong> Icons scale up, rotate, and
                fade out before opening social media pages
              </li>
              <li>
                • <strong>Hover Effects:</strong> Smooth scale and color
                transitions on hover
              </li>
              <li>
                • <strong>Ripple Effects:</strong> Animated ripple and particle
                effects on click
              </li>
              <li>
                • <strong>Tooltips:</strong> Platform names appear on hover
              </li>
              <li>
                • <strong>Multiple Variants:</strong> Default, Minimal, Glowing,
                and Floating styles
              </li>
              <li>
                • <strong>Responsive Sizes:</strong> Small, Medium, and Large
                icon sizes
              </li>
              <li>
                • <strong>Smooth Transitions:</strong> 500ms duration for all
                animations
              </li>
              <li>
                • <strong>Accessibility:</strong> Proper ARIA labels and
                keyboard navigation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaDemo;

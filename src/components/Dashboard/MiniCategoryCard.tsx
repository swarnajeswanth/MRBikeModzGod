import React from "react";
import { ArrowRight } from "lucide-react";

interface MiniCategoryCardProps {
  name: string;
  description: string;
  count: number;
  color: string; // Tailwind bg color class
  letter: string;
  onClick?: () => void;
  compact?: boolean;
  backgroundImage?: string;
}

const MiniCategoryCard: React.FC<MiniCategoryCardProps> = ({
  name,
  description,
  count,
  color,
  letter,
  onClick,
  compact = false,
  backgroundImage,
}) => {
  return (
    <div
      className={`group relative rounded-xl flex flex-col items-center justify-center gap-[10px] cursor-pointer transition-all duration-300 hover:scale-[1.03] shadow-md ${color}`}
      style={{ minHeight: "200px" }}
      onClick={onClick}
    >
      {/* Optional Background Image */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="category background"
          className="absolute inset-0 w-full h-full object-cover rounded-xl z-0"
          style={{ pointerEvents: "none" }}
        />
      )}
      {/* Dark Blur Overlay for Readability */}
      {backgroundImage && (
        <div className="absolute inset-0 rounded-xl bg-black/60 backdrop-blur-sm z-0" />
      )}
      {/* Overlay gradient for color (always present) */}
      <div
        className={`absolute inset-0 rounded-xl ${color} ${
          backgroundImage ? "opacity-70" : "opacity-80"
        } z-0`}
      />
      {/* Large Letter */}
      <div
        className={`absolute top-2 right-2 ${
          compact ? "w-7 h-7" : "w-10 h-10"
        } rounded-full border-2 border-white/40 flex items-center justify-center bg-white/10 z-10`}
      >
        <span
          className={`${compact ? "text-lg" : "text-2xl"} font-bold text-white`}
        >
          {letter}
        </span>
      </div>
      {/* Info */}
      <div className="z-10 flex flex-col items-center justify-center gap-[10px] w-full">
        <h3
          className={`${
            compact ? "text-base" : "text-xl"
          } font-bold text-white mb-0 text-center`}
        >
          {name}
        </h3>
        <p className={`text-xs text-white mb-0 text-center`}>{description}</p>
        <span
          className={`${
            compact ? "text-xs" : "text-sm"
          } text-white/80 text-center`}
        >
          {count} products
        </span>
      </div>
      {/* Arrow */}
      <div
        className={`absolute ${
          compact ? "bottom-2 right-2 w-6 h-6" : "bottom-4 right-4 w-8 h-8"
        } rounded-full flex items-center justify-center border border-white/20 transition-transform duration-300 group-hover:scale-125 z-10`}
        style={{ background: "#8e0005" }}
      >
        <ArrowRight
          className={`${compact ? "w-3 h-3" : "w-4 h-4"} text-white`}
        />
      </div>
    </div>
  );
};

export default MiniCategoryCard;

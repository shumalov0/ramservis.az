"use client";

import { FC } from "react";

interface PlaceholderImageProps {
  width: number;
  height: number;
  text: string;
  className?: string;
}

const PlaceholderImage: FC<PlaceholderImageProps> = ({ width, height, text, className = "" }) => {
  return (
    <div 
      className={`bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <div className="text-center p-4">
        <div className="text-gray-500 dark:text-gray-400 font-medium text-sm">
          {text}
        </div>
        <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">
          {width} × {height}
        </div>
      </div>
    </div>
  );
};

export default PlaceholderImage;
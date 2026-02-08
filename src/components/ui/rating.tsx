"use client";
import { Star } from "lucide-react";
import { useState } from "react";

interface RatingFieldProps {
  value: number;
  max?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
}

export const RatingField = ({
  value,
  max = 5,
  readOnly = false,
  onChange,
  size = 20,
  className,
}: RatingFieldProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const stars = Array.from({ length: max }, (_, i) => {
    const current = hoverValue !== null ? hoverValue : value;
    if (current >= i + 1) return "full";
    if (current >= i + 0.5) return "half";
    return "empty";
  });

  return (
    <div className={`flex items-center gap-1 ${className || ""}`}>
      {stars.map((type, i) => (
        <Star
          key={i}
          size={size}
          className={`cursor-pointer ${
            type !== "empty" ? "text-yellow-500" : "text-gray-300"
          }`}
          fill={type !== "empty" ? "currentColor" : "none"}
          onMouseEnter={() => !readOnly && setHoverValue(i + 1)}
          onMouseLeave={() => !readOnly && setHoverValue(null)}
          onClick={() => !readOnly && onChange?.(i + 1)}
        />
      ))}
    </div>
  );
};

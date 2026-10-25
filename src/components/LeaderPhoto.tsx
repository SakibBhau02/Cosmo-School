"use client";

import { useState } from "react";
import Image from "next/image";

// Leader portrait with graceful fallback: if the photo file is missing,
// show an initials avatar instead of a broken image.
export default function LeaderPhoto({
  src,
  fallbackSrc,
  name,
  className = "",
  sizes = "400px",
}: {
  src: string;
  fallbackSrc?: string;
  name: string;
  className?: string;
  sizes?: string;
}) {
  const [stage, setStage] = useState(0);
  const initial = name.trim().charAt(0);
  if (stage === 2 || (!src && !fallbackSrc)) {
    return (
      <span className={`grid place-items-center bg-pine-900 text-gold-300 font-display font-bold ${className}`}>
        <span className="text-5xl">{initial}</span>
      </span>
    );
  }
  return (
    <Image
      src={stage === 0 ? src : (fallbackSrc ?? src)}
      alt={name}
      fill
      sizes={sizes}
      className={`object-cover ${className}`}
      onError={() => setStage((s) => s + 1)}
    />
  );
}

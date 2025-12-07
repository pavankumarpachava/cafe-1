import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CinematicImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
  priority?: boolean;
}

export function CinematicImage({
  src,
  alt,
  className,
  aspectRatio = "auto",
  priority = false,
}: CinematicImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "",
  };

  return (
    <div className={cn("relative overflow-hidden", aspectClasses[aspectRatio], className)}>
      {/* Placeholder/skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className={cn(
          "w-full h-full object-cover",
          hasError && "opacity-50"
        )}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <span className="text-muted-foreground text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
}

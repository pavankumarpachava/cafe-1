import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CinematicImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
  priority?: boolean;
  enableHoverZoom?: boolean;
  enableShadow?: boolean;
}

export function CinematicImage({
  src,
  alt,
  className,
  aspectRatio = "auto",
  priority = false,
  enableHoverZoom = true,
  enableShadow = true,
}: CinematicImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "",
  };

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden rounded-lg", 
        aspectClasses[aspectRatio], 
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={enableShadow ? {
        boxShadow: isHovered 
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 30px rgba(212, 175, 55, 0.15)"
          : "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
      } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Placeholder/skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      {/* Cinematic overlay gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 pointer-events-none"
        animate={{ opacity: isHovered ? 0.6 : 0.3 }}
        transition={{ duration: 0.4 }}
      />
      
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          scale: isLoaded ? (enableHoverZoom && isHovered ? 1.08 : 1) : 1.15,
        }}
        transition={{
          opacity: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
          scale: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
        className={cn(
          "w-full h-full object-cover",
          hasError && "opacity-50"
        )}
      />
      
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full pointer-events-none"
        animate={{ x: isHovered ? "200%" : "-100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-20">
          <span className="text-muted-foreground text-sm">Image unavailable</span>
        </div>
      )}
    </motion.div>
  );
}

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SnowflakeProps {
  delay: number;
  duration: number;
  size: number;
  left: number;
  opacity: number;
  blur?: boolean;
  variant: number;
}

// SVG Snowflake shapes for realistic snow flurries
const SnowflakeSVG = ({ size, opacity }: { size: number; opacity: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ opacity }}
  >
    <path
      d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="text-card"
    />
    <circle cx="12" cy="12" r="2" fill="currentColor" className="text-card" />
    <circle cx="12" cy="5" r="1" fill="currentColor" className="text-card" />
    <circle cx="12" cy="19" r="1" fill="currentColor" className="text-card" />
    <circle cx="5" cy="12" r="1" fill="currentColor" className="text-card" />
    <circle cx="19" cy="12" r="1" fill="currentColor" className="text-card" />
  </svg>
);

const SnowflakeSVG2 = ({ size, opacity }: { size: number; opacity: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ opacity }}
  >
    <path
      d="M12 2v20M6 6l12 12M18 6L6 18M2 12h20"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className="text-card"
    />
    <path
      d="M12 7l-2-2M12 7l2-2M12 17l-2 2M12 17l2 2M7 12l-2-2M7 12l-2 2M17 12l2-2M17 12l2 2"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className="text-card"
    />
  </svg>
);

const SnowflakeSVG3 = ({ size, opacity }: { size: number; opacity: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ opacity }}
  >
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" className="text-card" />
    <path
      d="M12 2v4M12 18v4M2 12h4M18 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className="text-card"
    />
  </svg>
);

// Simple crystal flake
const CrystalFlake = ({ size, opacity }: { size: number; opacity: number }) => (
  <div 
    className="relative"
    style={{ width: size, height: size, opacity }}
  >
    <div 
      className="absolute inset-0 bg-card/90 rounded-full"
      style={{ 
        boxShadow: '0 0 8px rgba(255,255,255,0.6), inset 0 0 4px rgba(255,255,255,0.3)',
      }}
    />
  </div>
);

function Snowflake({ delay, duration, size, left, opacity, blur, variant }: SnowflakeProps) {
  const renderSnowflake = () => {
    switch (variant % 4) {
      case 0:
        return <SnowflakeSVG size={size} opacity={1} />;
      case 1:
        return <SnowflakeSVG2 size={size} opacity={1} />;
      case 2:
        return <SnowflakeSVG3 size={size} opacity={1} />;
      default:
        return <CrystalFlake size={size} opacity={1} />;
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none will-change-transform"
      style={{
        left: `${left}%`,
        width: size,
        height: size,
        filter: blur ? 'blur(0.5px)' : 'none',
        opacity,
      }}
      initial={{ y: -20, opacity: 0, rotate: 0 }}
      animate={{
        y: '110vh',
        opacity: [0, opacity, opacity, opacity * 0.5, 0],
        rotate: [0, 90, 180, 270, 360],
        x: [0, 15, -10, 20, -15, 5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {renderSnowflake()}
    </motion.div>
  );
}

interface SnowfallProps {
  intensity?: 'light' | 'medium' | 'heavy';
}

export function Snowfall({ intensity = 'medium' }: SnowfallProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Delay snowfall rendering to improve LCP
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Reduced count for better performance
  const count = intensity === 'light' ? 20 : intensity === 'medium' ? 35 : 50;

  const snowflakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 6,
      size: 8 + Math.random() * 14,
      left: Math.random() * 100,
      opacity: 0.4 + Math.random() * 0.5,
      blur: Math.random() > 0.85,
      variant: Math.floor(Math.random() * 4),
    }));
  }, [count]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {snowflakes.map((sf) => (
        <Snowflake
          key={sf.id}
          delay={sf.delay}
          duration={sf.duration}
          size={sf.size}
          left={sf.left}
          opacity={sf.opacity}
          blur={sf.blur}
          variant={sf.variant}
        />
      ))}
    </div>
  );
}
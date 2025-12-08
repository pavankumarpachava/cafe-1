import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SnowflakeProps {
  delay: number;
  duration: number;
  size: number;
  left: number;
  opacity: number;
  blur?: boolean;
}

function Snowflake({ delay, duration, size, left, opacity, blur }: SnowflakeProps) {
  return (
    <motion.div
      className="absolute pointer-events-none will-change-transform"
      style={{
        left: `${left}%`,
        width: size,
        height: size,
        filter: blur ? 'blur(1px)' : 'none',
      }}
      initial={{ y: -20, opacity: 0, rotate: 0 }}
      animate={{
        y: '110vh',
        opacity: [0, opacity, opacity, opacity * 0.5, 0],
        rotate: [0, 180, 360],
        x: [0, 30, -20, 25, -15, 10],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {/* Simplified snowflake for performance */}
      <div 
        className="w-full h-full rounded-full bg-card/80"
        style={{ boxShadow: '0 0 3px rgba(255,255,255,0.4)' }}
      />
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
      size: 3 + Math.random() * 8,
      left: Math.random() * 100,
      opacity: 0.5 + Math.random() * 0.5,
      blur: Math.random() > 0.8,
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
        />
      ))}
    </div>
  );
}
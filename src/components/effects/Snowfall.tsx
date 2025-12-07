import { useMemo } from 'react';
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
      className="absolute pointer-events-none"
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
      {/* Realistic snowflake shape */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-full h-full text-card/90"
      >
        <path d="M12 0L12.5 4.5L15 2L13.5 5.5L17 4L14 7L17.5 6.5L14.5 8.5L19 8L14.5 10L20 10L14.5 11L19 12L14 12L18 13.5L13.5 13L17 15L13 14L15.5 18L12 14.5L12 20L12 14.5L8.5 18L11 14L7 15L10.5 13L6 13.5L10 12L5 12L9.5 11L4 10L9.5 10L5 8L9.5 8.5L6.5 6.5L10 7L7 4L10.5 5.5L9 2L11.5 4.5L12 0Z" />
      </svg>
    </motion.div>
  );
}

// Simple circular snowflake for variety
function SimpleSnowflake({ delay, duration, size, left, opacity }: SnowflakeProps) {
  return (
    <motion.div
      className="absolute rounded-full bg-card pointer-events-none"
      style={{
        left: `${left}%`,
        width: size,
        height: size,
        opacity: opacity,
        boxShadow: '0 0 4px rgba(255,255,255,0.5)',
      }}
      initial={{ y: -20 }}
      animate={{
        y: '110vh',
        x: [0, 15, -10, 20, -5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

interface SnowfallProps {
  intensity?: 'light' | 'medium' | 'heavy';
}

export function Snowfall({ intensity = 'medium' }: SnowfallProps) {
  const count = intensity === 'light' ? 30 : intensity === 'medium' ? 50 : 80;

  const snowflakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 8,
      size: 4 + Math.random() * 12,
      left: Math.random() * 100,
      opacity: 0.4 + Math.random() * 0.6,
      blur: Math.random() > 0.7,
      isSimple: Math.random() > 0.6,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {snowflakes.map((sf) =>
        sf.isSimple ? (
          <SimpleSnowflake
            key={sf.id}
            delay={sf.delay}
            duration={sf.duration}
            size={sf.size * 0.5}
            left={sf.left}
            opacity={sf.opacity * 0.8}
          />
        ) : (
          <Snowflake
            key={sf.id}
            delay={sf.delay}
            duration={sf.duration}
            size={sf.size}
            left={sf.left}
            opacity={sf.opacity}
            blur={sf.blur}
          />
        )
      )}

      {/* Atmospheric fog/mist layers */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/30 to-transparent"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}

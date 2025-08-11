'use client';
import React, { useState } from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 10,
  className = '',
  color = '#6B7280',
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationDuration = `${speed}s`;

  const handleMouseEnter = () => {
    if (!disabled && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, speed * 1000);
    }
  };

  return (
    <div
      className={`bg-clip-text inline-block ${className}`}
      style={{
        color: isAnimating ? 'transparent' : color,
        backgroundImage:
          'linear-gradient(120deg, #FE3ED8 0%, #F6C2A4 25%, #F8FEC1 50%, #FFFFFF 75%, #FE3ED8 100%)',
        backgroundSize: '300% 100%',
        WebkitBackgroundClip: 'text',
        animation: isAnimating
          ? `shine ${animationDuration} ease-in-out forwards`
          : 'none',
      }}
      onMouseEnter={handleMouseEnter}
    >
      {text}
    </div>
  );
};

export default ShinyText;

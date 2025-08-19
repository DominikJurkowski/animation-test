'use client';
import React, { useEffect, useRef, useState } from 'react';

interface LiquidButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  className = '',
  onClick,
  disabled = false,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Animation loop for the liquid effect
  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.05;
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isHovering) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovering]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePosition({ x: 0, y: 0 });
  };

  // Generate tentacles and flame effects around button edges
  const generateTentacleEffect = () => {
    if (!isHovering) return [];

    const time = timeRef.current;
    const buttonWidth = 200; // Approximate button width
    const buttonHeight = 60; // Approximate button height
    const tentacleLength = 15; // Shorter tentacles closer to button
    const borderOffset = 2; // 2px from button border

    const tentacles = [];
    const colors = ['#FE3ED8', '#F6C2A4', '#F8FEC1', '#FFFFFF'];

    // Create tentacles at different positions around the button
    const tentaclePositions = [
      { x: borderOffset, y: borderOffset, direction: 'top' }, // Top-left
      { x: buttonWidth * 0.5, y: borderOffset, direction: 'top' }, // Top-center
      { x: buttonWidth - borderOffset, y: borderOffset, direction: 'top' }, // Top-right
      {
        x: buttonWidth - borderOffset,
        y: buttonHeight * 0.5,
        direction: 'right',
      }, // Right-center
      {
        x: buttonWidth - borderOffset,
        y: buttonHeight - borderOffset,
        direction: 'right',
      }, // Right-bottom
      {
        x: buttonWidth * 0.5,
        y: buttonHeight - borderOffset,
        direction: 'bottom',
      }, // Bottom-center
      { x: borderOffset, y: buttonHeight - borderOffset, direction: 'bottom' }, // Bottom-left
      { x: borderOffset, y: buttonHeight * 0.5, direction: 'left' }, // Left-center
    ];

    // Create multiple tentacles at each position
    tentaclePositions.forEach((pos, posIndex) => {
      for (let layer = 0; layer < 4; layer++) {
        const offsetX = (layer - 1.5) * 4; // Tighter separation
        const offsetY = (layer - 1.5) * 2;

        const points = [];
        const numPoints = 8;

        for (let i = 0; i < numPoints; i++) {
          const progress = i / numPoints;
          let x, y;

          // Create tentacle shape based on direction
          switch (pos.direction) {
            case 'top':
              x =
                pos.x +
                offsetX +
                Math.sin(progress * Math.PI + time * 2 + posIndex) * 8;
              y =
                pos.y -
                progress * tentacleLength +
                offsetY +
                Math.sin(progress * Math.PI * 2 + time * 1.5) * 4;
              break;
            case 'right':
              x =
                pos.x +
                progress * tentacleLength +
                offsetX +
                Math.sin(progress * Math.PI * 2 + time * 1.5) * 4;
              y =
                pos.y +
                offsetY +
                Math.sin(progress * Math.PI + time * 2 + posIndex) * 8;
              break;
            case 'bottom':
              x =
                pos.x +
                offsetX +
                Math.sin(progress * Math.PI + time * 2 + posIndex) * 8;
              y =
                pos.y +
                progress * tentacleLength +
                offsetY +
                Math.sin(progress * Math.PI * 2 + time * 1.5) * 4;
              break;
            case 'left':
              x =
                pos.x -
                progress * tentacleLength +
                offsetX +
                Math.sin(progress * Math.PI * 2 + time * 1.5) * 4;
              y =
                pos.y +
                offsetY +
                Math.sin(progress * Math.PI + time * 2 + posIndex) * 8;
              break;
          }

          points.push(`${x},${y}`);
        }

        tentacles.push({
          points: points.join(' '),
          color: colors[layer],
          opacity: 0.95 - layer * 0.15,
          filter: `blur(${layer * 0.5}px)`,
        });
      }
    });

    // Add flame/spark effects that step onto the button
    const flamePositions = [
      { x: 10, y: 5, direction: 'top' },
      { x: buttonWidth - 10, y: 5, direction: 'top' },
      { x: buttonWidth - 5, y: 15, direction: 'right' },
      { x: buttonWidth - 5, y: buttonHeight - 15, direction: 'right' },
      { x: 10, y: buttonHeight - 5, direction: 'bottom' },
      { x: buttonWidth - 10, y: buttonHeight - 5, direction: 'bottom' },
      { x: 5, y: 15, direction: 'left' },
      { x: 5, y: buttonHeight - 15, direction: 'left' },
    ];

    flamePositions.forEach((pos, posIndex) => {
      for (let layer = 0; layer < 3; layer++) {
        const offsetX = (layer - 1) * 3;
        const offsetY = (layer - 1) * 2;

        const points = [];
        const numPoints = 6;
        const flameLength = 8 + layer * 2;

        for (let i = 0; i < numPoints; i++) {
          const progress = i / numPoints;
          let x, y;

          // Create flame shape that steps onto the button
          switch (pos.direction) {
            case 'top':
              x =
                pos.x +
                offsetX +
                Math.sin(progress * Math.PI * 2 + time * 3 + posIndex) * 6;
              y =
                pos.y -
                progress * flameLength +
                offsetY +
                Math.sin(progress * Math.PI + time * 2) * 3;
              break;
            case 'right':
              x =
                pos.x +
                progress * flameLength +
                offsetX +
                Math.sin(progress * Math.PI + time * 2) * 3;
              y =
                pos.y +
                offsetY +
                Math.sin(progress * Math.PI * 2 + time * 3 + posIndex) * 6;
              break;
            case 'bottom':
              x =
                pos.x +
                offsetX +
                Math.sin(progress * Math.PI * 2 + time * 3 + posIndex) * 6;
              y =
                pos.y +
                progress * flameLength +
                offsetY +
                Math.sin(progress * Math.PI + time * 2) * 3;
              break;
            case 'left':
              x =
                pos.x -
                progress * flameLength +
                offsetX +
                Math.sin(progress * Math.PI + time * 2) * 3;
              y =
                pos.y +
                offsetY +
                Math.sin(progress * Math.PI * 2 + time * 3 + posIndex) * 6;
              break;
          }

          points.push(`${x},${y}`);
        }

        tentacles.push({
          points: points.join(' '),
          color: colors[layer],
          opacity: 0.9 - layer * 0.2,
          filter: `blur(${layer * 0.3}px)`,
        });
      }
    });

    return tentacles;
  };

  const tentacleEffect = generateTentacleEffect();

  return (
    <div
      className={`relative inline-block cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Tentacles and flames around button edges */}
      <div className='absolute inset-0 pointer-events-none overflow-visible'>
        <svg
          width='100%'
          height='100%'
          style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            width: 'calc(100% + 20px)',
            height: 'calc(100% + 20px)',
            zIndex: 1,
          }}
        >
          {tentacleEffect.map((tentacle, index) => (
            <polygon
              key={index}
              points={tentacle.points}
              fill={tentacle.color}
              opacity={tentacle.opacity}
              style={{
                filter: tentacle.filter,
                transition: 'opacity 0.3s ease',
              }}
            />
          ))}
        </svg>
      </div>

      {/* Button content - keeping original background */}
      <div
        className={`
           relative z-10 px-6 py-3 
           bg-gradient-to-r from-purple-600 to-pink-600 
           text-white font-semibold rounded-lg 
           shadow-lg hover:shadow-xl 
           transition-all duration-300 transform hover:scale-105
         `}
      >
        {children}
      </div>

      {/* Additional glow effect */}
      {isHovering && (
        <div
          className='absolute inset-0 rounded-lg pointer-events-none'
          style={{
            background:
              'radial-gradient(circle at center, rgba(254, 62, 216, 0.3) 0%, transparent 70%)',
            filter: 'blur(20px)',
            zIndex: 0,
          }}
        />
      )}
    </div>
  );
};

export default LiquidButton;

// app/components/VibrateLine.tsx
'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export default function VibrateLine({
  width = 400,
  height = 3,
  color = '#6b7280',
  className = '',
}: {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}) {
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    // Create the initial straight line path
    const initialPath = `M 0 ${height / 2} L ${width} ${height / 2}`;

    // Create smoother wiggling path variations with more natural curves
    const wigglePaths = [
      // First wave - larger amplitude
      `M 0 ${height / 2} Q ${width * 0.2} ${height / 2 - 15} ${width * 0.4} ${
        height / 2
      } Q ${width * 0.6} ${height / 2 + 15} ${width * 0.8} ${height / 2} Q ${
        width * 0.9
      } ${height / 2 - 8} ${width} ${height / 2}`,
      // Second wave - opposite direction
      `M 0 ${height / 2} Q ${width * 0.2} ${height / 2 + 12} ${width * 0.4} ${
        height / 2
      } Q ${width * 0.6} ${height / 2 - 12} ${width * 0.8} ${height / 2} Q ${
        width * 0.9
      } ${height / 2 + 6} ${width} ${height / 2}`,
      // Third wave - smaller amplitude
      `M 0 ${height / 2} Q ${width * 0.2} ${height / 2 - 8} ${width * 0.4} ${
        height / 2
      } Q ${width * 0.6} ${height / 2 + 8} ${width * 0.8} ${height / 2} Q ${
        width * 0.9
      } ${height / 2 - 4} ${width} ${height / 2}`,
      // Fourth wave - opposite direction
      `M 0 ${height / 2} Q ${width * 0.2} ${height / 2 + 6} ${width * 0.4} ${
        height / 2
      } Q ${width * 0.6} ${height / 2 - 6} ${width * 0.8} ${height / 2} Q ${
        width * 0.9
      } ${height / 2 + 3} ${width} ${height / 2}`,
      // Fifth wave - even smaller
      `M 0 ${height / 2} Q ${width * 0.2} ${height / 2 - 4} ${width * 0.4} ${
        height / 2
      } Q ${width * 0.6} ${height / 2 + 4} ${width * 0.8} ${height / 2} Q ${
        width * 0.9
      } ${height / 2 - 2} ${width} ${height / 2}`,
      // Sixth wave - opposite direction
      `M 0 ${height / 2} Q ${width * 0.2} ${height / 2 + 3} ${width * 0.4} ${
        height / 2
      } Q ${width * 0.6} ${height / 2 - 3} ${width * 0.8} ${height / 2} Q ${
        width * 0.9
      } ${height / 2 + 1} ${width} ${height / 2}`,
      // Seventh wave - very small
      `M 0 ${height / 2} Q ${width * 0.2} ${height / 2 - 2} ${width * 0.4} ${
        height / 2
      } Q ${width * 0.6} ${height / 2 + 2} ${width * 0.8} ${height / 2} Q ${
        width * 0.9
      } ${height / 2 - 1} ${width} ${height / 2}`,
      // Eighth wave - final small oscillation
      `M 0 ${height / 2} Q ${width * 0.2} ${height / 2 + 1} ${width * 0.4} ${
        height / 2
      } Q ${width * 0.6} ${height / 2 - 1} ${width * 0.8} ${height / 2} Q ${
        width * 0.9
      } ${height / 2 + 0.5} ${width} ${height / 2}`,
    ];

    // Set initial path
    gsap.set(line, { attr: { d: initialPath } });

    const enter = () => {
      // Create a smoother wiggle effect using path morphing with staggered timing
      const tl = gsap.timeline();

      wigglePaths.forEach((path, index) => {
        tl.to(line, {
          attr: { d: path },
          duration: 0.06, // Faster individual tweens for smoother effect
          ease: 'power1.inOut', // Smoother easing
        });
      });

      // Return to straight line with a gentle ease
      tl.to(line, {
        attr: { d: initialPath },
        duration: 0.12,
        ease: 'power2.out',
      });
    };

    const leave = () => {
      gsap.to(line, {
        attr: { d: initialPath },
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    // Add hover listeners to the SVG container
    const svg = line.closest('svg');
    if (svg) {
      svg.addEventListener('mouseenter', enter);
      svg.addEventListener('mouseleave', leave);

      return () => {
        svg.removeEventListener('mouseenter', enter);
        svg.removeEventListener('mouseleave', leave);
      };
    }
  }, [width, height]);

  return (
    <svg
      width={width}
      height={height}
      className={`cursor-pointer ${className}`}
      style={{ overflow: 'visible' }}
    >
      <path
        ref={lineRef}
        stroke={color}
        strokeWidth={height}
        strokeLinecap='round'
        fill='none'
      />
    </svg>
  );
}

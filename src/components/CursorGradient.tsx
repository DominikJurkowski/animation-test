'use client';
import { useEffect, useRef, useState } from 'react';

interface CursorGradientProps {
  circleRadius?: number;
  delay?: number;
  className?: string;
  trailLength?: number;
  trailDecay?: number;
}

export default function CursorGradient({
  circleRadius = 150,
  delay = 0.15,
  className = '',
  trailLength = 20,
  trailDecay = 0.95,
}: CursorGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const trailRef = useRef<Array<{ x: number; y: number; opacity: number }>>([]);
  const targetPosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Initialize canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isVisible) {
        // Smooth cursor following with delay
        const dx = targetPosRef.current.x - currentPosRef.current.x;
        const dy = targetPosRef.current.y - currentPosRef.current.y;
        currentPosRef.current.x += dx * delay;
        currentPosRef.current.y += dy * delay;

        // Add current position to trail
        trailRef.current.push({
          x: currentPosRef.current.x,
          y: currentPosRef.current.y,
          opacity: 1,
        });

        // Limit trail length
        if (trailRef.current.length > trailLength) {
          trailRef.current.shift();
        }

        // Update trail opacity
        trailRef.current.forEach((point) => {
          point.opacity *= trailDecay;
        });

        // Remove points with very low opacity
        trailRef.current = trailRef.current.filter(
          (point) => point.opacity > 0.01
        );

        // Draw trail (comet effect)
        trailRef.current.forEach((point) => {
          const radius = circleRadius * (0.3 + 0.7 * point.opacity); // Trail gets smaller

          // Add shadow blur for smoother blending between circles
          // ctx.shadowBlur = 20 + point.opacity * 30; // More blur for brighter points
          // ctx.shadowColor = 'rgba(254, 62, 216, 0.3)';

          // Create radial gradient for trail point
          const gradient = ctx.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            radius
          );

          // Adjust colors based on opacity for trail effect
          const alpha = point.opacity;
          gradient.addColorStop(0, `rgba(254, 62, 216, ${alpha * 0.8})`);
          gradient.addColorStop(0.15, `rgba(254, 62, 216, ${alpha * 0.6})`);
          gradient.addColorStop(0.59, `rgba(246, 194, 164, ${alpha * 0.4})`);
          gradient.addColorStop(0.9, `rgba(248, 254, 193, ${alpha * 0.2})`);
          gradient.addColorStop(1, `rgba(248, 254, 193, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
          ctx.fill();

          // Reset shadow for next iteration
          ctx.shadowBlur = 0;
        });
      } else {
        // Clear trail when not visible
        trailRef.current = [];
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [circleRadius, delay, isVisible, trailLength, trailDecay]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-50 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}

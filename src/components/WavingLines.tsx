import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

interface WavingLinesProps {
  className?: string;
  lineCount?: number;
  lineColor?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

class WavingLine {
  private x: number;
  private y: number;
  private length: number;
  private segments: number;
  private points: Array<{ x: number; y: number }>;
  private animation: gsap.core.Timeline;
  private speed: number;
  private amplitude: number;

  constructor(x: number, y: number, length: number, segments = 20) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.segments = segments;
    this.points = [];
    this.speed = 0.5 + Math.random() * 1; // Random speed between 0.5 and 1.5
    this.amplitude = 20 + Math.random() * 30; // Random amplitude between 20 and 50

    // Initialize points
    for (let i = 0; i <= segments; i++) {
      this.points.push({
        x: this.x + (i / segments) * this.length,
        y: this.y + Math.sin((i / segments) * Math.PI * 2) * this.amplitude,
      });
    }

    // Create animation timeline
    this.animation = gsap.timeline({ repeat: -1 });

    // Animate each point with a slight delay for wave effect
    this.points.forEach((point, index) => {
      const delay = (index / this.segments) * 0.5;
      this.animation.to(
        point,
        {
          y:
            this.y +
            Math.sin((index / this.segments) * Math.PI * 2 + Math.PI) *
              this.amplitude,
          duration: 2 * this.speed,
          delay: delay,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        },
        delay
      );
    });
  }

  draw(context: CanvasRenderingContext2D, lineWidth = 2, color = '#333') {
    context.save();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // Draw the line through all points
    context.beginPath();
    context.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      const prev = this.points[i - 1];
      const curr = this.points[i];

      // Use quadratic curves for smoother lines
      const cpX = (prev.x + curr.x) / 2;
      const cpY = (prev.y + curr.y) / 2;

      context.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
    }

    context.stroke();
    context.restore();
  }

  destroy() {
    if (this.animation) {
      this.animation.kill();
    }
  }
}

const WavingLines: React.FC<WavingLinesProps> = ({
  className = '',
  lineCount = 8,
  lineColor = '#333333',
  backgroundColor = '#ffffff',
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<WavingLine[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Clear any existing lines
    linesRef.current.forEach((line) => line.destroy());
    linesRef.current = [];

    // Create new lines
    const lineSpacing = canvas.height / (lineCount + 1);
    const lineLength = canvas.width * 0.8;
    const startX = canvas.width * 0.1;

    for (let i = 0; i < lineCount; i++) {
      const y = lineSpacing * (i + 1);
      const line = new WavingLine(startX, y, lineLength);
      linesRef.current.push(line);
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw all lines
      linesRef.current.forEach((line) => {
        line.draw(ctx, 2, lineColor);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      linesRef.current.forEach((line) => line.destroy());
    };
  }, [lineCount, lineColor, backgroundColor]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className='absolute inset-0 w-full h-full'
        style={{ display: 'block' }}
      />

      {/* Content overlay */}
      {children && <div className='relative z-10 h-full'>{children}</div>}
    </div>
  );
};

export default WavingLines;

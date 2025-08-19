import React, { useEffect, useRef, useState } from 'react';

interface SingleWavingLineProps {
  className?: string;
  lineColor?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

class SingleLine {
  private x: number;
  private y: number;
  private length: number;
  private segments: number;
  private points: Array<{ x: number; y: number }>;
  private amplitude: number;
  private baseAmplitude: number;
  private mouseX = 0;
  private mouseY = 0;
  private isHovering = false;
  private hoverIntensity = 0;
  private isAnimating = false;
  private time = 0;
  private animationSpeed = 0.02;

  constructor(x: number, y: number, length: number, segments = 50) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.segments = segments;
    this.points = [];
    this.baseAmplitude = 25;
    this.amplitude = this.baseAmplitude;

    // Initialize points as a straight line
    for (let i = 0; i <= segments; i++) {
      this.points.push({
        x: this.x + (i / segments) * this.length,
        y: this.y, // Straight line initially
      });
    }
  }

  startAnimation() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.time = 0;
  }

  stopAnimation() {
    if (!this.isAnimating) return;
    this.isAnimating = false;
  }

  updateMousePosition(mouseX: number, mouseY: number, isHovering: boolean) {
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.isHovering = isHovering;

    if (isHovering) {
      // Calculate distance from mouse to line center
      const distanceFromCenter = Math.abs(mouseY - this.y);
      const maxDistance = 200; // Larger influence area
      this.hoverIntensity = Math.max(0, 1 - distanceFromCenter / maxDistance);

      // Increase amplitude based on hover intensity
      this.amplitude = this.baseAmplitude + this.hoverIntensity * 40;

      // Start animation if not already animating
      if (!this.isAnimating) {
        this.startAnimation();
      }
    } else {
      this.hoverIntensity = 0;
      this.amplitude = this.baseAmplitude;

      // Stop animation
      this.stopAnimation();
    }
  }

  update(deltaTime: number) {
    if (!this.isAnimating) {
      // Gradually return to straight line
      this.points.forEach((point, index) => {
        const targetY = this.y;
        const currentY = point.y;
        const diff = targetY - currentY;
        point.y += diff * 0.1; // Smooth return
      });
      return;
    }

    // Update time for wave animation
    this.time += deltaTime * this.animationSpeed;

    // Update each point with wave animation
    this.points.forEach((point, index) => {
      const progress = index / this.segments;
      const waveOffset =
        Math.sin(this.time + progress * Math.PI * 2) * this.amplitude;

      // Add mouse influence
      let mouseInfluence = 0;
      if (this.isHovering) {
        const distanceFromMouse = Math.abs(this.mouseX - point.x);
        const maxMouseDistance = this.length * 0.3;
        if (distanceFromMouse < maxMouseDistance) {
          const influence =
            (1 - distanceFromMouse / maxMouseDistance) * this.hoverIntensity;
          const mousePull = (this.mouseY - this.y) * 0.2 * influence;
          mouseInfluence = mousePull;
        }
      }

      // Set final position
      point.y = this.y + waveOffset + mouseInfluence;
    });
  }

  draw(context: CanvasRenderingContext2D, lineWidth = 1.5, color = '#333') {
    context.save();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    // Draw the line through all points with smooth curves
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
}

const SingleWavingLine: React.FC<SingleWavingLineProps> = ({
  className = '',
  lineColor = '#333333',
  backgroundColor = '#ffffff',
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<SingleLine | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const lastTimeRef = useRef<number>(0);

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

    // Clear any existing line
    if (lineRef.current) {
      // No need to destroy, just create new instance
    }

    // Create new line
    const lineLength = canvas.width * 0.8;
    const startX = canvas.width * 0.1;
    const centerY = canvas.height / 2;

    lineRef.current = new SingleLine(startX, centerY, lineLength);

    // Mouse event handlers - like Studio Arde
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (lineRef.current && isHovering) {
        lineRef.current.updateMousePosition(x, y, true);
      }
    };

    const handleMouseEnter = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setIsHovering(true);

      if (lineRef.current) {
        lineRef.current.updateMousePosition(x, y, true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      if (lineRef.current) {
        lineRef.current.updateMousePosition(0, 0, false);
      }
    };

    // Add event listeners to canvas
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = (currentTime: number) => {
      if (!ctx || !lineRef.current) return;

      // Calculate delta time
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Update line animation
      lineRef.current.update(deltaTime);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the line
      lineRef.current.draw(ctx, 1.5, lineColor);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [lineColor, backgroundColor, isHovering]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className='absolute inset-0 w-full h-full cursor-default'
        style={{ display: 'block' }}
      />

      {/* Content overlay */}
      {children && <div className='relative z-10 h-full'>{children}</div>}
    </div>
  );
};

export default SingleWavingLine;

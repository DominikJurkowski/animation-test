import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

interface WaveBackgroundProps {
  className?: string;
  height?: string;
  children?: React.ReactNode;
}

class Wave {
  private lineWidth: number;
  private strokeStyle: string;
  private fillStyle: string;
  private x1: number;
  private y1: number;
  private x2: number;
  private y2: number;
  private x3: number;
  private y3: number;
  private x4: number;
  private y4: number;
  private lineX1: number;
  private lineY1: number;
  private animation: gsap.core.Timeline;

  constructor() {
    this.lineWidth = 8;
    this.strokeStyle = '#6c464f';
    this.fillStyle = '#9e768f';

    this.x1 = 200;
    this.y1 = 130;

    this.x1 = 50;
    this.y1 = 300;

    this.x2 = 300;
    this.y2 = 50;

    this.x3 = 200;
    this.y3 = 400;

    this.x4 = 490;
    this.y4 = 100;

    this.lineX1 = 490;
    this.lineY1 = 300;

    this.animation = gsap
      .timeline({
        repeat: -1,
        yoyo: true,
      })
      .to(this, {
        duration: 2,
        y2: 100,
        y3: 50,
        y4: 200,
        ease: 'sine.inOut',
      });
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();

    context.beginPath();
    context.moveTo(this.x1, this.y1);
    context.bezierCurveTo(this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
    context.lineTo(this.lineX1, this.lineY1);
    context.closePath();

    context.globalCompositeOperation = 'xor';
    context.lineWidth = this.lineWidth;
    context.fillStyle = this.fillStyle;
    context.strokeStyle = this.strokeStyle;
    context.miterLimit = 15;

    context.fill();
    context.stroke();
    context.restore();
  }

  destroy() {
    if (this.animation) {
      this.animation.kill();
    }
  }
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({
  className = '',
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveRef = useRef<Wave | null>(null);
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

    // Create wave instance
    waveRef.current = new Wave();

    // Animation loop
    const animate = () => {
      if (!ctx || !waveRef.current) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#FE3ED8');
      gradient.addColorStop(0.1, '#F6C2A4');
      gradient.addColorStop(0.2, '#F8FEC1');
      gradient.addColorStop(0.4, '#FFFFFF');

      // Fill background with gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw wave
      waveRef.current.draw(ctx);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (waveRef.current) {
        waveRef.current.destroy();
      }
    };
  }, []);

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

export default WaveBackground;

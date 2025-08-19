'use client';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';

interface ImageDistortionEffectProps {
  className?: string;
  imageSrc?: string;
  intensity?: number;
  speed?: number;
  children?: React.ReactNode;
}

class ImageDistortion {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  private mouseX = 0;
  private mouseY = 0;
  private isHovering = false;
  private time = 0;
  private intensity: number;
  private speed: number;

  constructor(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    intensity = 0.1,
    speed = 0.02
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.image = image;
    this.intensity = intensity;
    this.speed = speed;
  }

  updateMousePosition(mouseX: number, mouseY: number, isHovering: boolean) {
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.isHovering = isHovering;

    // Animate intensity based on hover state
    gsap.to(this, {
      intensity: isHovering ? this.intensity * 1.5 : this.intensity,
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  update(deltaTime: number) {
    this.time += deltaTime * this.speed;
  }

  draw() {
    const { width, height } = this.canvas;

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    // Create image data for manipulation
    const imageData = this.ctx.createImageData(width, height);
    const data = imageData.data;

    // Draw original image to get pixel data
    this.ctx.drawImage(this.image, 0, 0, width, height);
    const originalImageData = this.ctx.getImageData(0, 0, width, height);
    const originalData = originalImageData.data;

    // Apply distortion effect
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;

        // Calculate distortion offset
        let offsetX = 0;
        let offsetY = 0;

        if (this.isHovering) {
          // Mouse-based distortion
          const distanceFromMouse = Math.sqrt(
            Math.pow(x - this.mouseX, 2) + Math.pow(y - this.mouseY, 2)
          );
          const maxDistance = Math.min(width, height) * 0.3;

          if (distanceFromMouse < maxDistance) {
            const influence =
              (1 - distanceFromMouse / maxDistance) * this.intensity;
            offsetX = (this.mouseX - x) * influence * 0.1;
            offsetY = (this.mouseY - y) * influence * 0.1;
          }
        }

        // Add wave distortion
        const waveX = Math.sin(this.time + x * 0.01) * this.intensity * 10;
        const waveY = Math.cos(this.time + y * 0.01) * this.intensity * 10;

        offsetX += waveX;
        offsetY += waveY;

        // Get source pixel coordinates
        const srcX = Math.floor(x + offsetX);
        const srcY = Math.floor(y + offsetY);

        // Clamp coordinates
        const clampedX = Math.max(0, Math.min(width - 1, srcX));
        const clampedY = Math.max(0, Math.min(height - 1, srcY));

        // Get source pixel index
        const srcIndex = (clampedY * width + clampedX) * 4;

        // Copy pixel data
        data[index] = originalData[srcIndex]; // R
        data[index + 1] = originalData[srcIndex + 1]; // G
        data[index + 2] = originalData[srcIndex + 2]; // B
        data[index + 3] = originalData[srcIndex + 3]; // A
      }
    }

    // Put the distorted image data back to canvas
    this.ctx.putImageData(imageData, 0, 0);
  }
}

const ImageDistortionEffect: React.FC<ImageDistortionEffectProps> = ({
  className = '',
  imageSrc = '/images/pic9.png',
  intensity = 0.1,
  speed = 0.02,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const distortionRef = useRef<ImageDistortion | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const lastTimeRef = useRef<number>(0);

  // GSAP context for better performance
  useGSAP(
    () => {
      // GSAP context setup
    },
    { scope: canvasRef }
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load image
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      imageRef.current = image;
      setIsLoaded(true);
    };
    image.src = imageSrc;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [imageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image || !isLoaded) return;

    // Create distortion effect
    distortionRef.current = new ImageDistortion(
      canvas,
      image,
      intensity,
      speed
    );

    // Mouse event handlers
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (distortionRef.current && isHovering) {
        distortionRef.current.updateMousePosition(x, y, true);
      }
    };

    const handleMouseEnter = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setIsHovering(true);

      if (distortionRef.current) {
        distortionRef.current.updateMousePosition(x, y, true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      if (distortionRef.current) {
        distortionRef.current.updateMousePosition(0, 0, false);
      }
    };

    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = (currentTime: number) => {
      if (!distortionRef.current) return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      distortionRef.current.update(deltaTime);
      distortionRef.current.draw();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLoaded, intensity, speed, isHovering]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Loading state */}
      {!isLoaded && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm'>
          <div className='text-white text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2'></div>
            <p className='text-sm'>Loading image...</p>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className='absolute inset-0 w-full h-full cursor-pointer'
        style={{ display: 'block' }}
      />

      {/* Content overlay */}
      {children && (
        <div className='relative z-10 h-full flex items-center justify-center'>
          {children}
        </div>
      )}
    </div>
  );
};

export default ImageDistortionEffect;

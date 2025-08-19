'use client';
import React, { useEffect, useRef, useState } from 'react';

interface LiquidDistortionEffectProps {
  className?: string;
  imageSrc?: string;
  children?: React.ReactNode;
}

const LiquidDistortionEffect: React.FC<LiquidDistortionEffectProps> = ({
  className = '',
  imageSrc = '/images/portret.png',
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const timeRef = useRef(0);

  // Load image
  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      imageRef.current = image;
      setIsLoaded(true);
    };
    image.src = imageSrc;
  }, [imageSrc]);

  // Canvas setup and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image || !isLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation function
    const animate = () => {
      timeRef.current += 0.05; // Faster animation

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create image data for manipulation
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      // Draw original image to get pixel data
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const originalImageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      const originalData = originalImageData.data;

      // Apply effect based on hover state
      if (isHovering) {
        // Apply chromatic aberration/rainbow effect only when hovering
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;

            // Calculate distortion offset
            let offsetX = 0;
            let offsetY = 0;

            // Mouse-based ripple effect
            const distanceFromMouse = Math.sqrt(
              Math.pow(x - mousePosition.x, 2) +
                Math.pow(y - mousePosition.y, 2)
            );
            const maxDistance = Math.min(canvas.width, canvas.height) * 0.3;

            if (distanceFromMouse < maxDistance) {
              const influence = (1 - distanceFromMouse / maxDistance) * 0.8;

              // Create multiple colorful ripple waves
              const ripple1 =
                Math.sin(distanceFromMouse * 0.02 - timeRef.current * 2) *
                influence *
                25;
              const ripple2 =
                Math.sin(distanceFromMouse * 0.04 - timeRef.current * 3) *
                influence *
                15;
              const ripple3 =
                Math.cos(distanceFromMouse * 0.03 - timeRef.current * 1.5) *
                influence *
                10;

              offsetX += ripple1 + ripple2;
              offsetY += ripple2 + ripple3;
            }

            // Chromatic aberration with Aurora colors - separate channels with different offsets
            const redOffsetX = offsetX + 15; // Red channel offset (increased)
            const redOffsetY = offsetY + 8;

            const greenOffsetX = offsetX + 5; // Green channel (slight offset)
            const greenOffsetY = offsetY + 3;

            const blueOffsetX = offsetX - 5; // Blue channel offset
            const blueOffsetY = offsetY - 3;

            const pinkOffsetX = offsetX - 15; // Pink channel offset
            const pinkOffsetY = offsetY - 8;

            // Sample red channel
            const redX = Math.floor(x + redOffsetX);
            const redY = Math.floor(y + redOffsetY);
            const clampedRedX = Math.max(0, Math.min(canvas.width - 1, redX));
            const clampedRedY = Math.max(0, Math.min(canvas.height - 1, redY));
            const redIndex = (clampedRedY * canvas.width + clampedRedX) * 4;

            // Sample green channel
            const greenX = Math.floor(x + greenOffsetX);
            const greenY = Math.floor(y + greenOffsetY);
            const clampedGreenX = Math.max(
              0,
              Math.min(canvas.width - 1, greenX)
            );
            const clampedGreenY = Math.max(
              0,
              Math.min(canvas.height - 1, greenY)
            );
            const greenIndex =
              (clampedGreenY * canvas.width + clampedGreenX) * 4;

            // Sample blue channel
            const blueX = Math.floor(x + blueOffsetX);
            const blueY = Math.floor(y + blueOffsetY);
            const clampedBlueX = Math.max(0, Math.min(canvas.width - 1, blueX));
            const clampedBlueY = Math.max(
              0,
              Math.min(canvas.height - 1, blueY)
            );
            const blueIndex = (clampedBlueY * canvas.width + clampedBlueX) * 4;

            // Sample pink channel
            const pinkX = Math.floor(x + pinkOffsetX);
            const pinkY = Math.floor(y + pinkOffsetY);
            const clampedPinkX = Math.max(0, Math.min(canvas.width - 1, pinkX));
            const clampedPinkY = Math.max(
              0,
              Math.min(canvas.height - 1, pinkY)
            );
            const pinkIndex = (clampedPinkY * canvas.width + clampedPinkX) * 4;

            // Combine channels with Aurora color gradient effect
            // Mix the channels to create the Aurora gradient colors
            const red =
              originalData[redIndex] * 0.4 + originalData[pinkIndex] * 0.6; // More pink
            const green =
              originalData[greenIndex + 1] * 0.7 +
              originalData[redIndex + 1] * 0.3; // Warm green
            const blue =
              originalData[blueIndex + 2] * 0.5 +
              originalData[greenIndex + 2] * 0.5; // Cyan-blue

            data[index] = Math.min(255, red); // R
            data[index + 1] = Math.min(255, green); // G
            data[index + 2] = Math.min(255, blue); // B
            data[index + 3] = originalData[greenIndex + 3]; // A
          }
        }
      } else {
        // When not hovering, just copy the original image data without any distortion
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const srcIndex = (y * canvas.width + x) * 4;

            data[index] = originalData[srcIndex]; // R
            data[index + 1] = originalData[srcIndex + 1]; // G
            data[index + 2] = originalData[srcIndex + 2]; // B
            data[index + 3] = originalData[srcIndex + 3]; // A
          }
        }
      }

      // Put the distorted image data back to canvas
      ctx.putImageData(imageData, 0, 0);

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLoaded, mousePosition, isHovering]);

  // Mouse event handlers
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * window.devicePixelRatio;
    const y = (event.clientY - rect.top) * window.devicePixelRatio;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePosition({ x: 0, y: 0 });
  };

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
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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

export default LiquidDistortionEffect;

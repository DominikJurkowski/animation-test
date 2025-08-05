// components/GradientBackground.jsx
'use client';

import { gsap } from 'gsap';
import { ReactNode, useEffect, useRef } from 'react';

export default function GradientBackground({
  children,
}: {
  children?: ReactNode;
}) {
  const firstLayerRef = useRef<HTMLDivElement>(null);
  const secondLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use opacity animation instead of background animation for better performance
    gsap
      .timeline({ repeat: -1, yoyo: true, repeatDelay: 2 })
      .to(firstLayerRef.current, {
        ease: 'power1.inOut',
        duration: 8,
        opacity: 0.3,
      })
      .to(firstLayerRef.current, {
        ease: 'power1.inOut',
        duration: 8,
        opacity: 1,
      });

    // Animate second layer with rotation for variation
    gsap
      .timeline({ repeat: -1, yoyo: true, repeatDelay: 3, delay: 4 })
      .to(secondLayerRef.current, {
        ease: 'power1.inOut',
        duration: 10,
        opacity: 0.5,
        rotation: 1,
      })
      .to(secondLayerRef.current, {
        ease: 'power1.inOut',
        duration: 10,
        opacity: 1,
        rotation: -1,
      });
  }, []);
  return (
    <div className='relative w-full h-screen bg-white overflow-hidden'>
      {/* First gradient layer */}
      <div
        ref={firstLayerRef}
        className='absolute top-0 left-0 right-0 h-[60%] blur-[1px]'
        style={{
          background: `
            linear-gradient(170deg, #FE3ED8 0%, #F6C2A4 28.64%, #F8FEC1 48%, #FFFFFF 66.7%),
            linear-gradient(180deg, rgba(254, 62, 216, 0.9) 0%, rgba(246, 194, 164, 0.8) 30%, rgba(248, 254, 193, 0.6) 50%, rgba(255, 255, 255, 0.9) 100%)
          `,
        }}
      />

      {/* Content */}
      <div className='relative z-10 w-full h-full flex items-center justify-center'>
        {children || (
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-800 mb-4'>
              Irregular Gradient Recreation
            </h1>
            <p className='text-gray-600'>
              Notice how the gradient blends organically with the white
              background
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

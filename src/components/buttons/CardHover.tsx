'use client';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

export default function TailwindCardHover() {
  const cardRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: cardRef });

  const handleMouseEnter = contextSafe(() => {
    gsap.to('.card', {
      y: -10,
      rotationX: 5,
      rotationY: 5,
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to('.card-image', {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to('.card-overlay', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to('.card', {
      y: 0,
      rotationX: 0,
      rotationY: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to('.card-image', {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to('.card-overlay', {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  return (
    <div
      ref={cardRef}
      className='flex justify-center items-center min-h-screen bg-gray-900 p-8'
    >
      <div
        className='card bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer max-w-sm transition-none'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className='relative overflow-hidden'>
          <img
            className='card-image w-full h-64 object-cover transition-none'
            src='https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=250&fit=crop'
            alt='Beautiful landscape'
          />
          <div className='card-overlay absolute inset-0 bg-black bg-opacity-20 opacity-0 flex items-center justify-center'>
            <span className='text-white text-lg font-semibold'>
              View Details
            </span>
          </div>
        </div>
        <div className='p-6'>
          <h3 className='text-xl font-bold text-gray-800 mb-2'>Amazing Card</h3>
          <p className='text-gray-600'>
            This card demonstrates GSAP animations with Tailwind CSS styling.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import BubblesBackground from '@/components/Bubbles';
import GlowingBorderButton from '@/components/GlowingBorderButton';

export default function AnimationPage() {
  return (
    <div>
      <BubblesBackground />
      <div className='space-y-6'>
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
          Glowing Border Animation (GSAP)
        </h2>

        <div className='flex flex-col items-center space-y-4'>
          <GlowingBorderButton
            variant='button'
            onClick={() => alert('Button clicked!')}
          >
            Click Me - Glowing Button
          </GlowingBorderButton>

          <GlowingBorderButton variant='text'>
            Hover Me - Glowing Text
          </GlowingBorderButton>
        </div>

        <p className='text-sm text-gray-600 max-w-md mx-auto'>
          Hover over the elements above to see the glowing border animation. The
          animation runs once per hover using GSAP with the flame/spark color
          palette.
        </p>
      </div>
    </div>
  );
}

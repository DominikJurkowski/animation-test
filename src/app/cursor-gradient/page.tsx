'use client';
import React from 'react';

import CursorGradient from '@/components/CursorGradient';

export default function CursorGradientDemo() {
  return (
    <div className='min-h-screen bg-white text-gray-900'>
      {/* Cursor Gradient Effect */}
      <CursorGradient circleRadius={100} delay={0.1} />

      {/* Content */}
      <div className='relative z-10 p-8'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-5xl font-bold mb-8 text-center'>
            Cursor Gradient Trail
          </h1>

          <div className='bg-gray-100/80 backdrop-blur-sm rounded-lg p-8 mb-8 border border-gray-200'>
            <h2 className='text-2xl font-semibold mb-4'>About This Effect</h2>
            <p className='text-gray-700 mb-4'>
              Move your cursor around the screen to see the radial gradient
              follow your mouse with a beautiful comet-like trail effect.
            </p>
            <div className='grid md:grid-cols-2 gap-4 text-sm'>
              <div>
                <h3 className='font-semibold text-pink-600 mb-2'>
                  Gradient Colors:
                </h3>
                <ul className='space-y-1 text-gray-700'>
                  <li>• Pink (#FE3ED8) - Center</li>
                  <li>• Peach (#F6C2A4) - Middle</li>
                  <li>• Light Yellow (#F8FEC1) - Outer</li>
                  <li>• White (#FFFFFF) - Edge</li>
                </ul>
              </div>
              <div>
                <h3 className='font-semibold text-pink-600 mb-2'>Features:</h3>
                <ul className='space-y-1 text-gray-700'>
                  <li>• Smooth cursor following</li>
                  <li>• Comet-like trail effect</li>
                  <li>• Radial gradient animation</li>
                  <li>• Opacity decay over time</li>
                </ul>
              </div>
            </div>
          </div>

          <div className='grid md:grid-cols-3 gap-6'>
            <div className='bg-gray-100/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200'>
              <h3 className='text-xl font-semibold mb-3 text-pink-600'>
                Interactive
              </h3>
              <p className='text-gray-700'>
                The gradient follows your cursor movement in real-time, creating
                a responsive and engaging experience.
              </p>
            </div>

            <div className='bg-gray-100/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200'>
              <h3 className='text-xl font-semibold mb-3 text-pink-600'>
                Smooth Trail
              </h3>
              <p className='text-gray-700'>
                The comet-like trail effect creates a beautiful visual path that
                gradually fades as it follows your cursor.
              </p>
            </div>

            <div className='bg-gray-100/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200'>
              <h3 className='text-xl font-semibold mb-3 text-pink-600'>
                Performance
              </h3>
              <p className='text-gray-700'>
                Optimized canvas rendering ensures smooth 60fps animation
                without impacting page performance.
              </p>
            </div>
          </div>

          <div className='mt-12 bg-gray-100/80 backdrop-blur-sm rounded-lg p-8 border border-gray-200'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>
              Try Different Movements
            </h2>
            <div className='grid md:grid-cols-2 gap-8'>
              <div>
                <h3 className='text-lg font-semibold mb-3 text-pink-600'>
                  Slow Movement
                </h3>
                <p className='text-gray-700 mb-4'>
                  Move your cursor slowly to see the full gradient trail effect
                  with maximum opacity.
                </p>
                <div className='space-y-2 text-sm text-gray-600'>
                  <p>• Creates longer, more visible trails</p>
                  <p>• Shows full color gradient</p>
                  <p>• Smooth, flowing effect</p>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-3 text-pink-600'>
                  Fast Movement
                </h3>
                <p className='text-gray-700 mb-4'>
                  Move your cursor quickly to see the dynamic trail effect with
                  varying opacity levels.
                </p>
                <div className='space-y-2 text-sm text-gray-600'>
                  <p>• Creates dynamic, energetic trails</p>
                  <p>• Shows opacity decay effect</p>
                  <p>• More dramatic visual impact</p>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-8 text-center text-gray-600'>
            <p>Move your cursor around to experience the full effect!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

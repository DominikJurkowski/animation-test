'use client';

import * as React from 'react';
import '@/lib/env';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <main>
      <section className='bg-white'>
        <div className='container mx-auto px-4 py-16'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
            All Animation Routes
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <a
              href='/'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Home</h3>
              <p className='text-gray-600'>Main landing page</p>
            </a>
            <a
              href='/animation'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Animation
              </h3>
              <p className='text-gray-600'>Basic animation examples</p>
            </a>
            <a
              href='/animations'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Animations
              </h3>
              <p className='text-gray-600'>Animation collection</p>
            </a>
            <a
              href='/aurora'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Aurora
              </h3>
              <p className='text-gray-600'>Aurora effect</p>
            </a>
            <a
              href='/aurora-demo'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Aurora Demo
              </h3>
              <p className='text-gray-600'>Aurora demonstration</p>
            </a>
            <a
              href='/aurora-liquid'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Aurora Liquid
              </h3>
              <p className='text-gray-600'>Liquid aurora effect</p>
            </a>
            <a
              href='/aurora-simple'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Aurora Simple
              </h3>
              <p className='text-gray-600'>Simple aurora effect</p>
            </a>
            <a
              href='/burning-reveal'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Burning Reveal
              </h3>
              <p className='text-gray-600'>Burning reveal animation</p>
            </a>
            <a
              href='/cursor-gradient'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Cursor Gradient
              </h3>
              <p className='text-gray-600'>Cursor gradient effect</p>
            </a>
            <a
              href='/image-card'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Image Card
              </h3>
              <p className='text-gray-600'>Image card animations</p>
            </a>
            <a
              href='/image-distortion'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Image Distortion
              </h3>
              <p className='text-gray-600'>Image distortion effects</p>
            </a>
            <a
              href='/image-trail'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Image Trail
              </h3>
              <p className='text-gray-600'>Image trail effect</p>
            </a>
            <a
              href='/image-trail-aurora'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Image Trail Aurora
              </h3>
              <p className='text-gray-600'>Image trail with aurora</p>
            </a>
            <a
              href='/image-trail-duotone'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Image Trail Duotone
              </h3>
              <p className='text-gray-600'>Image trail with duotone effect</p>
            </a>
            <a
              href='/image-trail-transition'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Image Trail Transition
              </h3>
              <p className='text-gray-600'>Image trail transitions</p>
            </a>
            <a
              href='/image-trail-plasma'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Image Trail Transition Plasma
              </h3>
              <p className='text-gray-600'>
                Image trail transitions with plasma
              </p>
            </a>
            <a
              href='/liquid-button'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Liquid Button
              </h3>
              <p className='text-gray-600'>Liquid button animation</p>
            </a>
            <a
              href='/liquid-chrome'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Liquid Chrome
              </h3>
              <p className='text-gray-600'>Liquid chrome effect</p>
            </a>
            <a
              href='/organic'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Organic
              </h3>
              <p className='text-gray-600'>Organic animation effects</p>
            </a>
            <a
              href='/plasma'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Plasma
              </h3>
              <p className='text-gray-600'>
                Plasma effect with gradient colors
              </p>
            </a>
            <a
              href='/single-line'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Single Line
              </h3>
              <p className='text-gray-600'>Single line animation</p>
            </a>
            <a
              href='/waving-lines'
              className='block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Waving Lines
              </h3>
              <p className='text-gray-600'>Waving lines animation</p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

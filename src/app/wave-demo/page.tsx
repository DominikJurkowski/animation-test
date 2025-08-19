'use client';

import WaveBackground from '@/components/WaveBackground';

export default function WaveDemoPage() {
  return (
    <div className='h-screen w-full'>
      <WaveBackground className='h-full'>
        <div className='flex items-center justify-center h-full'>
          <div className='text-center text-white z-20'>
            <h1 className='text-6xl font-bold mb-6'>Wave Animation</h1>
            <p className='text-2xl mb-8'>Canvas + GSAP + Your Gradient</p>
            <div className='space-y-4'>
              <p className='text-lg'>Features:</p>
              <ul className='text-sm space-y-2'>
                <li>• Animated wave using GSAP timeline</li>
                <li>• Canvas-based rendering</li>
                <li>• Custom gradient background</li>
                <li>• Responsive design</li>
                <li>• Smooth bezier curve animation</li>
              </ul>
            </div>
          </div>
        </div>
      </WaveBackground>
    </div>
  );
}

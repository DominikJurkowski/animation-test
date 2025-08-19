'use client';

import WavingLines from '@/components/WavingLines';

export default function WavingLinesPage() {
  return (
    <div className='h-screen w-full'>
      <WavingLines
        className='h-full'
        lineCount={12}
        lineColor='#333333'
        backgroundColor='#ffffff'
      >
        <div className='flex items-center justify-center h-full'>
          <div className='text-center text-gray-800 z-20'>
            <h1 className='text-6xl font-bold mb-6'>Waving Lines</h1>
            <div className='space-y-4'>
              <p className='text-lg'>Features:</p>
              <ul className='text-sm space-y-2'>
                <li>• Multiple animated lines with wave motion</li>
                <li>• Canvas-based rendering with GSAP</li>
                <li>• Smooth quadratic curve interpolation</li>
                <li>• Random speed and amplitude variations</li>
                <li>• Responsive design</li>
                <li>• Clean white background with dark lines</li>
              </ul>
            </div>
          </div>
        </div>
      </WavingLines>
    </div>
  );
}

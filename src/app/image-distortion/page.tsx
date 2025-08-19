import React from 'react';

import LiquidDistortionEffect from '@/components/LiquidDistortionEffect';

export default function ImageDistortionPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      <div className='aspect-video max-w-4xl mx-auto p-8'>
        <LiquidDistortionEffect
          imageSrc='/images/portret.png'
          className='w-full h-full'
        />
      </div>
    </div>
  );
}

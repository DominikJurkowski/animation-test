'use client';

import SingleWavingLine from '@/components/SingleWavingLine';

export default function SingleLinePage() {
  return (
    <div className='h-screen w-full'>
      <SingleWavingLine
        className='h-full'
        lineColor='#333333'
        backgroundColor='#ffffff'
      />
    </div>
  );
}

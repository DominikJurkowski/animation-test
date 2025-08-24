'use client';

import ImageTrailDuotoneTransitionComponent from '@/components/image/ImageTrailDuotoneTransition';
import Plasma from '@/components/Plasma';

export default function ImageTrailAuroraPage() {
  const testImages = [
    '/images/trail/pic1.png',
    '/images/trail/pic2.png',
    '/images/trail/pic3.png',
    '/images/trail/pic4.png',
    '/images/trail/pic5.png',
    '/images/trail/pic6.png',
    '/images/trail/pic7.png',
    '/images/trail/pic8.png',
    '/images/trail/pic9.png',
    '/images/trail/pic10.png',
    '/images/trail/pic11.png',
  ];

  return (
    <div className='h-screen relative overflow-hidden'>
      {/* AuroraLiquid background */}
      <div className='absolute inset-0 w-full h-full'>
        <Plasma
          color={['#FE3ED8', '#F6C2A4', '#F8FEC1']}
          speed={0.6}
          direction='forward'
          scale={1.1}
          opacity={0.8}
          mouseInteractive={false}
        />
      </div>

      {/* Header text */}
      <div className='absolute top-16 left-16 z-20 pointer-events-none'>
        <h1
          className='text-black'
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '7.5rem',
            fontWeight: 400,
            lineHeight: '110%',
          }}
        >
          Pathways to your next career milestone
        </h1>
      </div>

      {/* ImageTrailDuotone overlay */}
      <div className='relative z-10 w-full h-full'>
        <ImageTrailDuotoneTransitionComponent
          items={testImages}
          duotoneColor1='rgb(234,218,179)'
          duotoneColor2='rgb(229,5,206)'
          duotoneIntensity={1.2}
          duotoneNoiseAmount={0.15}
          duotoneEnabled={true}
          duotoneDuration={1.8}
        />
      </div>
    </div>
  );
}

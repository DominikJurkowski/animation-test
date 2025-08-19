'use client';

import AuroraLiquid from '@/components/AuroraLiquid';
import ImageTrailDuotoneComponent from '@/components/image/ImageTrailDuotone';

export default function ImageTrailAuroraPage() {
  const color1 = 'rgb(234,218,179)';
  const color2 = 'rgb(229,5,206)';

  const images = [
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
        <AuroraLiquid
          colorStops={['#FE3ED8', '#F6C2A4', '#F8FEC1', '#FFFFFF']}
          amplitude={0.8}
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
        <ImageTrailDuotoneComponent
          key='ImageTrailDuotone'
          items={images}
          duotoneColor1={color1}
          duotoneColor2={color2}
          duotoneIntensity={1}
          duotoneNoiseAmount={0.1}
          duotoneEnabled={true}
        />
      </div>
    </div>
  );
}

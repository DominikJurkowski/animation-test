'use client';

import ImageTrailDuotoneComponent from '@/components/image/ImageTrailDuotone';

export default function ImageTrailDuotoneAdvancedPage() {
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
  );
}

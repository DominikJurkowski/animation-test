'use client';

import ImageTrailDuotoneTransitionComponent from '@/components/image/ImageTrailDuotoneTransition';

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

export default function ImageTrailTransitionPage() {
  return (
    <div className='w-full h-screen relative overflow-hidden'>
      <ImageTrailDuotoneTransitionComponent
        items={testImages}
        duotoneColor1='rgb(234,218,179)'
        duotoneColor2='rgb(229,5,206)'
        duotoneIntensity={1.2}
        duotoneNoiseAmount={0.15}
        duotoneEnabled={true}
        duotoneDuration={3.0}
      />
    </div>
  );
}

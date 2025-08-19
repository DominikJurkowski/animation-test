// components/GradientBackgroundOption1.jsx
'use client';

import { ReactNode, useRef } from 'react';

export default function GradientBackgroundOption1({
  children,
}: {
  children?: ReactNode;
}) {
  const firstLayerRef = useRef<HTMLDivElement>(null);
  const secondLayerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   // Use opacity animation instead of background animation for better performance
  //   gsap
  //     .timeline({ repeat: -1, yoyo: true, repeatDelay: 2 })
  //     .to(firstLayerRef.current, {
  //       ease: 'power1.inOut',
  //       duration: 7,
  //       opacity: 0.3,
  //     })
  //     .to(firstLayerRef.current, {
  //       ease: 'power1.inOut',
  //       duration: 4,
  //       opacity: 0.6,
  //     })
  //     .to(firstLayerRef.current, {
  //       ease: 'power1.inOut',
  //       duration: 7,
  //       opacity: 1,
  //     });

  //   // Animate second layer with rotation for variation
  // }, []);

  // const radialBackground = ` radial-gradient(farthest-corner at 100% 100%, #FE3ED8 0%, #F6C2A4 28.64%, #F8FEC1 48%, #FFFFFF 66.7%) `;

  // useEffect(() => {
  //   gsap.set(firstLayerRef.current, {
  //     background: radialBackground,
  //   });
  // }, []);

  return (
    <div className='relative w-full h-screen bg-white overflow-hidden'>
      {/* First gradient layer */}
      <div
        ref={firstLayerRef}
        className='absolute bottom-0 left-0 right-0 h-[60%] blur-[1px]'
        style={{
          background: `
            radial-gradient(ellipse 40% 60% at 85% 100%, #FE3ED8 0%, #F6C2A4 28.64%, #F8FEC1 48%, transparent 70%), 
            radial-gradient(ellipse 40% 60% at 15% 100%, #FE3ED8 0%, #F6C2A4 28.64%, #F8FEC1 48%, transparent 70%)
          `,
          // background: `
          //   linear-gradient(0deg, #FE3ED8 0%, #F6C2A4 28.64%, #F8FEC1 48%, #FFFFFF 66.7%),
          //   linear-gradient(10deg, rgba(254, 62, 216, 0.9) 0%, rgba(246, 194, 164, 0.8) 30%, rgba(248, 254, 193, 0.6) 50%, rgba(255, 255, 255, 0.9) 100%)
          // `,
        }}
      />
      <div
        ref={secondLayerRef}
        className='absolute bottom-0 left-0 right-0 h-[10%] blur-[1px]'
        style={{
          background: `linear-gradient(0deg, #FE3ED8 -1%, transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className='relative z-10 w-full h-full flex items-center justify-center'>
        {children || (
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-800 mb-4'>
              Footer Gradient Recreation
            </h1>
            <p className='text-gray-600'>
              Notice how the gradient blends organically with the white
              background
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

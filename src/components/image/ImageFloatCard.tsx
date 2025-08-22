'use client';

import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function ImageFloatCard() {
  const imageRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      imageRef.current,
      {
        y: 0,
        duration: 4,
        ease: 'power2.inOut',
      },
      {
        y: 100,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
      }
    );
  }, []);

  return (
    <div className='w-[600px] h-[600px] flex flex-col items-center justify-center bg-[#FF47CD] rounded-md relative'>
      <h1
        className='text-black text-center w-full absolute top-[calc(50%-100px)] left-1/2 -translate-x-1/2 -translate-y-1/2'
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '4.5rem',
          fontWeight: 400,
          lineHeight: '110%',
        }}
      >
        Designing digital flagship experiences
      </h1>
      <div ref={imageRef} className='w-full h-full'>
        <Image
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          src='/images/laptop.svg'
          alt='Alternative text image'
          width={400}
          height={400}
        />
      </div>
    </div>
  );
}

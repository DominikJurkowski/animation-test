'use client';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function TailwindScrollAnimations() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      // Fade in cards on scroll
      gsap.fromTo(
        '.fade-card',
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.cards-container',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Parallax background
      gsap.to('.parallax-bg', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: '.parallax-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      {/* Hero Section */}
      <section className='min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center'>
        <h1 className='text-6xl font-bold text-white text-center'>
          Scroll Down to See Magic
        </h1>
      </section>

      {/* Parallax Section */}
      <section className='parallax-section relative min-h-screen overflow-hidden flex items-center justify-center'>
        <div className='parallax-bg absolute inset-0 bg-gradient-to-br from-pink-400 to-orange-500 -z-10'></div>
        <div className='relative z-10 text-center text-white'>
          <h2 className='text-5xl font-bold mb-4'>Parallax Background</h2>
          <p className='text-xl'>This background moves at a different speed</p>
        </div>
      </section>

      {/* Cards Section */}
      <section className='cards-container min-h-screen bg-gray-100 py-20'>
        <div className='container mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center mb-16 text-gray-800'>
            Animated Cards
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className='fade-card bg-white rounded-xl shadow-lg p-8 text-center'
              >
                <div className='w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center'>
                  <span className='text-white text-2xl font-bold'>{num}</span>
                </div>
                <h3 className='text-xl font-bold text-gray-800 mb-4'>
                  Feature {num}
                </h3>
                <p className='text-gray-600'>
                  This card animates into view as you scroll down the page using
                  GSAP and ScrollTrigger.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

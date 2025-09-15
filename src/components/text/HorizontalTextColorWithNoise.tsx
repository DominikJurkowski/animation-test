'use client';

import { gsap } from 'gsap';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface HorizontalTextColorNoiseRevealProps {
  children: string;
  className?: string;
  duration?: number;
  stagger?: number;
  blurAmount?: number;
  onComplete?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  // Performance options
  useGPUAcceleration?: boolean;
  reduceMotion?: boolean;
  // Animation trigger options
  trigger?: 'hover' | 'mount' | 'intersection' | 'manual';
  delay?: number;
  // Intersection observer options
  threshold?: number;
  rootMargin?: string;
  // State options
  stayDirty?: boolean; // Keep the dirty, blurred state instead of clearing
}

const HorizontalTextColorNoiseReveal: React.FC<
  HorizontalTextColorNoiseRevealProps
> = ({
  children,
  className,
  duration = 0.6,
  stagger = 0.05,
  blurAmount = 10,
  onComplete,
  onHover,
  onLeave,
  useGPUAcceleration = true,
  reduceMotion = false,
  trigger = 'intersection',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  stayDirty = false,
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  // Memoize letter splitting with color transition effect
  const letters = useMemo(
    () =>
      children.split('').map((letter, index) => (
        <span
          key={`${children.length}-${index}-${letter}`}
          className='inline-block'
          style={{
            filter: `blur(${blurAmount}px) brightness(0.8) contrast(1.5) saturate(2)`,
            opacity: 0,
            transform: 'translateX(-20px)',
            color: '#F3F69A', // Start with yellow color
            // GPU acceleration optimizations
            ...(useGPUAcceleration && {
              willChange: 'filter, opacity, transform, color',
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }),
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      )),
    [children, useGPUAcceleration, blurAmount]
  );

  // Clean and optimized animation function with color transitions
  const animateText = useCallback(() => {
    if (!textRef.current || isAnimating || hasAnimated) return;

    // For mount triggers, ensure we never animate again
    if (trigger === 'mount' && hasAnimated) return;

    // Handle reduced motion
    if (reduceMotion || prefersReducedMotion) {
      const letterElements = textRef.current.children;
      gsap.set(letterElements, {
        filter: 'blur(0px)',
        opacity: 1,
        x: 0,
        color: 'inherit', // Original text color
      });
      setHasAnimated(true);
      onComplete?.();
      return;
    }

    setIsAnimating(true);
    const letterElements = textRef.current.children;

    // Performance optimizations
    if (useGPUAcceleration) {
      gsap.set(letterElements, {
        willChange: 'filter, opacity, transform, color',
        force3D: true,
      });
    }

    // Create beautiful horizontal reveal animation with color transitions
    const tl = gsap.timeline({
      delay: delay,
      onComplete: () => {
        // Clean up performance optimizations
        if (useGPUAcceleration) {
          gsap.set(letterElements, {
            willChange: 'auto',
            force3D: false,
          });
        }
        setIsAnimating(false);
        setHasAnimated(true);
        onComplete?.();
      },
    });

    // Main reveal animation with colors tightly coupled to blur intensity
    tl.to(letterElements, {
      filter: stayDirty
        ? `blur(${
            blurAmount * 0.3
          }px) brightness(0.8) contrast(1.5) saturate(2)`
        : 'blur(0px) brightness(1) contrast(1) saturate(1)',
      opacity: 1,
      x: 0,
      duration: duration,
      stagger: stagger,
      ease: 'power2.out',
      ...(useGPUAcceleration && {
        force3D: true,
        transformOrigin: 'center center',
      }),
    })
      // Color sequence tightly coupled to blur reveal - colors change as blur clears
      .to(
        letterElements,
        {
          color: '#F3F69A', // Yellow - starts when blur is heaviest
          duration: duration * 0.4,
          stagger: stagger,
          ease: 'power2.out',
        },
        0 // Start immediately with blur
      )
      .to(
        letterElements,
        {
          color: '#F1BC5C', // Orange - as blur starts clearing
          duration: duration * 0.3,
          stagger: stagger,
          ease: 'power2.out',
        },
        duration * 0.2 // Start when blur is 80% of original
      )
      .to(
        letterElements,
        {
          color: '#FE59BA', // Pink - as blur clears more
          filter: 'blur(2px)', // Add blur to pink for dirty effect
          duration: duration * 0.2,
          stagger: stagger,
          ease: 'power2.out',
        },
        duration * 0.5 // Start when blur is 50% of original
      )
      .to(
        letterElements,
        {
          color: stayDirty ? '#FE59BA' : 'inherit', // Stay pink if dirty, otherwise black
          filter: stayDirty
            ? `blur(${
                blurAmount * 0.3
              }px) brightness(0.8) contrast(1.5) saturate(2)`
            : 'blur(0px)', // Keep dirty state or clear blur
          duration: duration * 0.3,
          stagger: stagger,
          ease: 'power2.out',
        },
        duration * 0.7 // Start when blur is 30% of original
      );
  }, [
    textRef,
    isAnimating,
    hasAnimated,
    reduceMotion,
    prefersReducedMotion,
    duration,
    stagger,
    onComplete,
    useGPUAcceleration,
    delay,
    stayDirty,
  ]);

  // Reset animation state
  const resetAnimation = useCallback(() => {
    if (!textRef.current) return;

    const letterElements = textRef.current.children;
    gsap.set(letterElements, {
      filter: `blur(${blurAmount}px) brightness(0.8) contrast(1.5) saturate(2)`,
      opacity: 0,
      x: -20,
      color: '#F3F69A', // Reset to yellow
      willChange: 'auto',
      force3D: false,
    });
    setHasAnimated(false);
  }, [textRef, blurAmount]);

  // Clean event handlers
  const handleMouseEnter = useCallback(() => {
    if (trigger !== 'hover' || isAnimating) return;

    onHover?.();
    animateText();
  }, [trigger, isAnimating, onHover, animateText]);

  const handleMouseLeave = useCallback(() => {
    if (trigger !== 'hover') return;
    onLeave?.();
  }, [trigger, onLeave]);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    if (trigger !== 'intersection' || !textRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            animateText();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(textRef.current);

    return () => {
      observer.disconnect();
    };
  }, [trigger, hasAnimated, animateText, threshold, rootMargin]);

  // Initialize animation based on trigger type
  useEffect(() => {
    if (!textRef.current) return;

    // Only reset animation for non-mount triggers to prevent looping
    if (trigger !== 'mount') {
      resetAnimation();
    }

    if (trigger === 'mount') {
      animateText();
    }
  }, [children, blurAmount, resetAnimation, trigger, animateText]);

  // Cleanup and memory management
  useEffect(() => {
    const currentTextRef = textRef.current;
    return () => {
      if (currentTextRef) {
        gsap.killTweensOf(currentTextRef.children);
        gsap.set(currentTextRef.children, {
          willChange: 'auto',
          force3D: false,
        });
      }
    };
  }, []);

  // Memoize text classes for performance
  const textClasses = useMemo(() => cn('inline-block', className), [className]);

  return (
    <span
      ref={textRef}
      className={textClasses}
      onMouseEnter={trigger === 'hover' ? handleMouseEnter : undefined}
      onMouseLeave={trigger === 'hover' ? handleMouseLeave : undefined}
      style={{
        // Performance optimizations
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        ...(useGPUAcceleration && {
          transformStyle: 'preserve-3d',
        }),
      }}
    >
      {letters}
    </span>
  );
};

export default HorizontalTextColorNoiseReveal;

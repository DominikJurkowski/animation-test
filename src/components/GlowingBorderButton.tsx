'use client';

import { cn } from '@/lib/utils';

interface GlowingBorderButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'button' | 'text';
  disabled?: boolean;
  onClick?: () => void;
}

export default function GlowingBorderButton({
  children,
  className,
  variant = 'button',
  disabled = false,
  onClick,
}: GlowingBorderButtonProps) {
  const baseClasses = cn(
    'glowing-box relative inline-block cursor-pointer select-none rounded-lg',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const contentClasses = cn(
    'relative z-10 text-center font-semibold transition-colors duration-300',
    variant === 'button'
      ? 'px-8 py-4 bg-gray-900 text-white rounded-lg'
      : 'px-4 py-2 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 rounded-lg'
  );

  return (
    <>
      {/* Global styles for the animation */}
      <style jsx global>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        .glowing-box {
          border-radius: 0.5rem;
        }

        .glowing-box::before,
        .glowing-box::after {
          content: '';
          position: absolute;
          inset: -2px;
          z-index: -1;
          background: conic-gradient(
            from var(--angle),
            #fe3ed8,
            #f6c2a4,
            #f8fec1,
            #ffffff,
            #fe3ed8
          );
          border-radius: 0.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .glowing-box::after {
          z-index: -2;
          filter: blur(10px);
        }

        .glowing-box:hover::before,
        .glowing-box:hover::after,
        .glowing-box:focus::before,
        .glowing-box:focus::after {
          animation: glowing-border-complete 1.5s linear forwards;
        }

        @keyframes glowing-border-complete {
          0% {
            opacity: 0;
            --angle: 0deg;
          }
          10% {
            opacity: 1;
          }
          80% {
            opacity: 1;
            --angle: 360deg;
          }
          100% {
            opacity: 0;
            --angle: 360deg;
          }
        }
      `}</style>

      <div
        className={baseClasses}
        onClick={disabled ? undefined : onClick}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && onClick && !disabled) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {/* Content */}
        <div className={contentClasses}>{children}</div>
      </div>
    </>
  );
}

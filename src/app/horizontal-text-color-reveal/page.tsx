'use client';

import HorizontalTextColorReveal from '@/components/text/HorizontalTextColorReveal';

export default function HorizontalTextColorRevealPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-12'>
          <HorizontalTextColorReveal
            className='text-4xl font-bold text-black mb-4 block'
            trigger='mount'
            delay={0.5}
            duration={1.2}
            stagger={0.08}
          >
            Reverse Burning Effect
          </HorizontalTextColorReveal>
          <HorizontalTextColorReveal
            className='text-lg text-black max-w-2xl mx-auto block'
            trigger='mount'
            delay={1.8}
            duration={1.0}
            stagger={0.06}
          >
            Each letter reveals horizontally with blur effects while
            transitioning through orange to pink to black colors, creating a
            beautiful burning effect.
          </HorizontalTextColorReveal>
        </div>

        {/* Scroll-triggered Examples */}
        <div className='space-y-20'>
          {/* Intersection Observer Trigger */}
          <div className='text-center'>
            <HorizontalTextColorReveal
              className='text-3xl font-bold text-black'
              trigger='intersection'
              duration={1.0}
              stagger={0.08}
            >
              Scroll to See Burning Effect
            </HorizontalTextColorReveal>
          </div>

          {/* Different Styling */}
          <div className='text-center'>
            <HorizontalTextColorReveal
              className='text-2xl font-semibold text-gray-800'
              trigger='intersection'
              duration={1.0}
              stagger={0.1}
              blurAmount={15}
            >
              Custom Blur and Timing
            </HorizontalTextColorReveal>
          </div>

          {/* Long Text */}
          <div className='text-center'>
            <HorizontalTextColorReveal
              className='text-lg text-gray-600'
              trigger='intersection'
              duration={1.2}
              stagger={0.12}
            >
              This is a longer text example that demonstrates how the horizontal
              color reveal works with multiple words and characters, creating a
              beautiful flowing animation effect with pink and orange gradients.
            </HorizontalTextColorReveal>
          </div>

          {/* Different Sizes */}
          <div className='space-y-8'>
            <div className='text-center'>
              <HorizontalTextColorReveal
                className='text-sm text-gray-500'
                trigger='intersection'
                delay={0.2}
                duration={0.6}
                stagger={0.05}
              >
                Small Text
              </HorizontalTextColorReveal>
            </div>

            <div className='text-center'>
              <HorizontalTextColorReveal
                className='text-4xl font-bold text-gray-800'
                trigger='intersection'
                delay={0.4}
                duration={0.8}
                stagger={0.08}
              >
                Large Text
              </HorizontalTextColorReveal>
            </div>

            <div className='text-center'>
              <HorizontalTextColorReveal
                className='text-6xl font-extrabold text-gray-800'
                trigger='intersection'
                duration={1.5}
                stagger={0.15}
                delay={0.6}
              >
                Extra Large
              </HorizontalTextColorReveal>
            </div>
          </div>

          {/* Multiple Lines with Stagger */}
          <div className='text-center space-y-6'>
            <HorizontalTextColorReveal
              className='text-2xl font-bold text-gray-800 block'
              trigger='intersection'
              delay={0}
              duration={0.8}
              stagger={0.08}
            >
              Beautiful
            </HorizontalTextColorReveal>
            <HorizontalTextColorReveal
              className='text-xl text-gray-700 block'
              trigger='intersection'
              delay={0.5}
              duration={0.8}
              stagger={0.08}
            >
              Color
            </HorizontalTextColorReveal>
            <HorizontalTextColorReveal
              className='text-3xl font-extrabold text-gray-800 block'
              trigger='intersection'
              delay={1}
              duration={1.0}
              stagger={0.1}
            >
              Text Animation
            </HorizontalTextColorReveal>
          </div>

          {/* Hover Examples */}
          <div className='bg-white rounded-lg p-8 shadow-lg'>
            <h3 className='text-xl font-semibold mb-6 text-gray-800 text-center'>
              Hover Examples
            </h3>
            <div className='space-y-6'>
              <div className='text-center'>
                <HorizontalTextColorReveal
                  className='text-2xl font-semibold text-gray-800'
                  trigger='hover'
                  duration={0.6}
                  stagger={0.05}
                >
                  Hover to Reveal Colors
                </HorizontalTextColorReveal>
              </div>

              <div className='text-center'>
                <HorizontalTextColorReveal
                  className='text-lg text-gray-700'
                  trigger='hover'
                  duration={0.8}
                  stagger={0.08}
                  blurAmount={12}
                >
                  Custom Blur Effect
                </HorizontalTextColorReveal>
              </div>
            </div>
          </div>

          {/* Auto Mount Examples */}
          <div className='bg-white rounded-lg p-8 shadow-lg'>
            <h3 className='text-xl font-semibold mb-6 text-gray-800 text-center'>
              Auto Mount Examples
            </h3>
            <div className='space-y-4'>
              <HorizontalTextColorReveal
                className='text-xl font-bold text-gray-800 block text-center'
                trigger='mount'
                delay={0}
                duration={0.8}
                stagger={0.08}
              >
                Instant Color Reveal
              </HorizontalTextColorReveal>
              <HorizontalTextColorReveal
                className='text-lg text-gray-700 block text-center'
                trigger='mount'
                delay={1}
                duration={0.8}
                stagger={0.08}
              >
                Delayed Color Reveal
              </HorizontalTextColorReveal>
            </div>
          </div>

          {/* Color Showcase */}
          <div className='bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg p-8 shadow-lg'>
            <h3 className='text-xl font-semibold mb-6 text-gray-800 text-center'>
              Color Gradient Showcase
            </h3>
            <div className='space-y-6'>
              <div className='text-center'>
                <HorizontalTextColorReveal
                  className='text-3xl font-bold text-gray-800'
                  trigger='intersection'
                  duration={1.0}
                  stagger={0.1}
                >
                  Pink & Orange Magic
                </HorizontalTextColorReveal>
              </div>

              <div className='text-center'>
                <HorizontalTextColorReveal
                  className='text-2xl font-semibold text-gray-700'
                  trigger='intersection'
                  duration={1.2}
                  stagger={0.12}
                  delay={0.5}
                >
                  Gradient Text Effects
                </HorizontalTextColorReveal>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className='mt-20 text-center'>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
            <h4 className='text-lg font-semibold text-blue-900 mb-2'>
              How the Reverse Burning Effect Works
            </h4>
            <ul className='text-blue-800 space-y-1 text-sm text-left max-w-2xl mx-auto'>
              <li>
                • <strong>Intersection:</strong> Animates when text comes into
                view (default)
              </li>
              <li>
                • <strong>Hover:</strong> Animates when you hover over the text
              </li>
              <li>
                • <strong>Mount:</strong> Animates immediately when component
                loads
              </li>
              <li>
                • Text animates from left to right with blur and slide effects
              </li>
              <li>
                • <strong>Color transition:</strong> Orange (#F1BC5C) → Pink
                (#FE59BA) → Black (original)
              </li>
              <li>
                • Each letter reveals horizontally with blur effects while
                transitioning through colors
              </li>
              <li>
                • Original horizontal reveal animation combined with color
                transitions
              </li>
              <li>• Optimized for performance with GPU acceleration</li>
              <li>• Respects reduced motion preferences</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

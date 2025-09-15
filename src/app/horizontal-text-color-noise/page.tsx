'use client';

import HorizontalTextColorNoiseReveal from '@/components/text/HorizontalTextColorWithNoise';

export default function HorizontalTextColorNoisePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-12'>
          <HorizontalTextColorNoiseReveal
            className='text-4xl font-bold text-black mb-4 block'
            trigger='mount'
            delay={2.0}
            duration={1.2}
            stagger={0.08}
          >
            Gradient Noise Effect
          </HorizontalTextColorNoiseReveal>
          <HorizontalTextColorNoiseReveal
            className='text-lg text-black max-w-2xl mx-auto block'
            trigger='mount'
            delay={3.5}
            duration={1.0}
            stagger={0.06}
          >
            Text with Gradient Noise Effect
          </HorizontalTextColorNoiseReveal>
        </div>

        {/* Mount Examples with Different States */}
        <div className='space-y-20'>
          {/* Example that clears to normal state */}
          <div className='text-center'>
            <HorizontalTextColorNoiseReveal
              className='text-2xl font-semibold text-black'
              trigger='mount'
              delay={5.5}
              duration={1.0}
              stagger={0.05}
              blurAmount={8}
              stayDirty={false}
            >
              Normal Clear State
            </HorizontalTextColorNoiseReveal>
            <p className='text-sm text-gray-600 mt-4 max-w-2xl mx-auto'>
              This example loads on mount and transitions to the clean, clear
              state (default behavior). Compare this with the dirty state above
              to see the difference.
            </p>
          </div>

          {/* Example that reveals and stays revealed (no reset) */}
          <div className='text-center'>
            <HorizontalTextColorNoiseReveal
              className='text-7xl font-bold text-black'
              trigger='mount'
              delay={3.5}
              duration={1.5}
              stagger={0.08}
              blurAmount={12}
              stayDirty={false}
            >
              Revealed Forever
            </HorizontalTextColorNoiseReveal>
            <p className='text-sm text-gray-600 mt-4 max-w-2xl mx-auto'>
              This example reveals the text with the full color sequence and
              blur effect, then stays in the final clean state forever. No
              reset, no re-animation. The text remains readable and static after
              the reveal completes.
            </p>
          </div>
        </div>

        {/* Scroll-triggered Examples */}
        <div className='space-y-20'>
          {/* Intersection Observer Trigger */}
          <div className='text-center'>
            <HorizontalTextColorNoiseReveal
              className='text-3xl font-bold text-black'
              trigger='intersection'
              delay={1.5}
              duration={1.0}
              stagger={0.08}
            >
              Scroll to See Gradient Noise
            </HorizontalTextColorNoiseReveal>
          </div>

          {/* Different Styling */}
          <div className='text-center'>
            <HorizontalTextColorNoiseReveal
              className='text-2xl font-semibold text-black'
              trigger='intersection'
              delay={2.0}
              duration={1.2}
              stagger={0.1}
              blurAmount={15}
            >
              Enhanced Blur with Noise
            </HorizontalTextColorNoiseReveal>
          </div>

          {/* Long Text */}
          <div className='text-center'>
            <HorizontalTextColorNoiseReveal
              className='text-lg text-black'
              trigger='intersection'
              duration={1.4}
              stagger={0.12}
            >
              This is a longer text example that demonstrates how the smooth
              gradient noise effect works with multiple words and characters,
              creating a beautiful flowing animation with irregular noise
              patterns.
            </HorizontalTextColorNoiseReveal>
          </div>

          {/* Different Sizes */}
          <div className='space-y-8'>
            <div className='text-center'>
              <HorizontalTextColorNoiseReveal
                className='text-sm text-black'
                trigger='intersection'
                delay={0.2}
                duration={0.8}
                stagger={0.05}
              >
                Small Text with Noise
              </HorizontalTextColorNoiseReveal>
            </div>

            <div className='text-center'>
              <HorizontalTextColorNoiseReveal
                className='text-4xl font-bold text-black'
                trigger='intersection'
                delay={0.4}
                duration={1.0}
                stagger={0.08}
              >
                Large Text with Noise
              </HorizontalTextColorNoiseReveal>
            </div>

            <div className='text-center'>
              <HorizontalTextColorNoiseReveal
                className='text-6xl font-extrabold text-black'
                trigger='intersection'
                duration={1.6}
                stagger={0.15}
                delay={0.6}
              >
                Extra Large Noise
              </HorizontalTextColorNoiseReveal>
            </div>
          </div>

          {/* Multiple Lines with Stagger */}
          <div className='text-center space-y-6'>
            <HorizontalTextColorNoiseReveal
              className='text-2xl font-bold text-black block'
              trigger='intersection'
              delay={0}
              duration={1.0}
              stagger={0.08}
            >
              Smooth
            </HorizontalTextColorNoiseReveal>
            <HorizontalTextColorNoiseReveal
              className='text-xl text-black block'
              trigger='intersection'
              delay={0.5}
              duration={1.0}
              stagger={0.08}
            >
              Gradient
            </HorizontalTextColorNoiseReveal>
            <HorizontalTextColorNoiseReveal
              className='text-3xl font-extrabold text-black block'
              trigger='intersection'
              delay={1}
              duration={1.2}
              stagger={0.1}
            >
              Noise Effect
            </HorizontalTextColorNoiseReveal>
          </div>

          {/* Hover Examples */}
          <div className='bg-white rounded-lg p-8 shadow-lg'>
            <h3 className='text-xl font-semibold mb-6 text-gray-800 text-center'>
              Hover Examples
            </h3>
            <div className='space-y-6'>
              <div className='text-center'>
                <HorizontalTextColorNoiseReveal
                  className='text-2xl font-semibold text-black'
                  trigger='hover'
                  duration={0.8}
                  stagger={0.05}
                >
                  Hover for Gradient Noise
                </HorizontalTextColorNoiseReveal>
              </div>

              <div className='text-center'>
                <HorizontalTextColorNoiseReveal
                  className='text-lg text-black'
                  trigger='hover'
                  duration={1.0}
                  stagger={0.08}
                  blurAmount={12}
                >
                  Enhanced Blur Effect
                </HorizontalTextColorNoiseReveal>
              </div>
            </div>
          </div>

          {/* Auto Mount Examples */}
          <div className='bg-white rounded-lg p-8 shadow-lg'>
            <h3 className='text-xl font-semibold mb-6 text-gray-800 text-center'>
              Auto Mount Examples
            </h3>
            <div className='space-y-4'>
              <HorizontalTextColorNoiseReveal
                className='text-xl font-bold text-black block text-center'
                trigger='mount'
                delay={0}
                duration={1.0}
                stagger={0.08}
              >
                Instant Gradient Noise
              </HorizontalTextColorNoiseReveal>
              <HorizontalTextColorNoiseReveal
                className='text-lg text-black block text-center'
                trigger='mount'
                delay={1.5}
                duration={1.0}
                stagger={0.08}
              >
                Delayed Gradient Noise
              </HorizontalTextColorNoiseReveal>
            </div>
          </div>

          {/* Color Showcase */}
          <div className='rounded-lg p-8 shadow-lg'>
            <h3 className='text-xl font-semibold mb-6 text-gray-800 text-center'>
              Showcase
            </h3>
            <div className='space-y-6'>
              <div className='text-center'>
                <HorizontalTextColorNoiseReveal
                  className='text-3xl font-bold text-black'
                  trigger='intersection'
                  duration={1.2}
                  stagger={0.1}
                >
                  Pink → Orange → Yellow
                </HorizontalTextColorNoiseReveal>
              </div>

              <div className='text-center'>
                <HorizontalTextColorNoiseReveal
                  className='text-2xl font-semibold text-black'
                  trigger='intersection'
                  duration={1.4}
                  stagger={0.12}
                  delay={0.5}
                >
                  Noise Gradient Magic
                </HorizontalTextColorNoiseReveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

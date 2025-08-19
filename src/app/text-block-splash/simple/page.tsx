'use client';
import React, { useState } from 'react';

import TextBlockWithSplash from '../../../components/TextBlockWithSplash';

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 };
}

export default function SimpleTextBlockSplash() {
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  return (
    <div className='min-h-screen bg-white'>
      {/* Mobile Testing Section */}
      <div className='pt-8 pb-8 px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <h2 className='text-lg font-semibold text-blue-800 mb-2'>
              Mobile Testing Guide
            </h2>
            <div className='text-sm text-blue-700 space-y-2'>
              <p>
                • <strong>Touch Interaction:</strong> Tap and drag on the screen
                to create fluid animations
              </p>
              <p>
                • <strong>Scroll Testing:</strong> Scroll through the content to
                test performance
              </p>
              <p>
                • <strong>Orientation:</strong> Try rotating your device to test
                responsive behavior
              </p>
              <p>
                • <strong>Performance:</strong> Monitor for smooth animations
                and responsive touch
              </p>
            </div>
            <button
              onClick={() => setShowMobileInfo(!showMobileInfo)}
              className='mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors'
            >
              {showMobileInfo ? 'Hide' : 'Show'} Mobile Info
            </button>
          </div>

          {showMobileInfo && (
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6'>
              <h3 className='font-semibold text-gray-800 mb-2'>
                Mobile Testing Features:
              </h3>
              <ul className='text-sm text-gray-700 space-y-1'>
                <li>
                  • Touch events are properly handled for fluid simulation
                </li>
                <li>• Responsive design adapts to different screen sizes</li>
                <li>• Performance optimized for mobile devices</li>
                <li>• Scroll behavior is smooth and non-intrusive</li>
                <li>• Text remains readable on all backgrounds</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className='relative'>
        <TextBlockWithSplash
          title='Simple Text Block with Splash'
          content='This is a simple example of the TextBlockWithSplash component. The fluid animation runs in the background while displaying your text content. You can move your mouse around to interact with the fluid simulation.'
          splashProps={{
            BACK_COLOR: hexToRgb('#FE3ED8'), // Pink/magenta
            TRANSPARENT: false,

            // Make animation stay longer - lower values = longer persistence
            DENSITY_DISSIPATION: 0.6, // Lower value = color stays longer on screen
            VELOCITY_DISSIPATION: 0.3, // Lower value = movement continues longer

            // Make animation less aggressive - moderate values for gentler effects
            SPLAT_RADIUS: 0.25, // Smaller radius for gentler splashes
            SPLAT_FORCE: 8000, // Lower force for softer interactions
            CURL: 0.8, // Less swirling for calmer movement

            // Simulation quality
            SIM_RESOLUTION: 128, // Higher resolution for smoother simulation
            DYE_RESOLUTION: 1024, // Higher resolution for better color quality

            // Pressure settings for fluid behavior
            PRESSURE: 0.5, // Lower pressure for gentler movement
            PRESSURE_ITERATIONS: 16, // Balanced iterations for good pressure solving

            // Visual effects
            SHADING: true, // Enable shading for better visual depth
            COLOR_UPDATE_SPEED: 80, // Slower color changes for more stable appearance
          }}
          showSplash={true}
          lightMode={true}
        />
      </div>

      {/* Scroll Testing Content */}
      <div className='bg-gray-50 py-16 px-4'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
            Scroll Testing Section
          </h2>

          <div className='grid md:grid-cols-2 gap-8'>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                Performance Testing
              </h3>
              <p className='text-gray-700 mb-4'>
                Scroll through this content to test how the fluid animation
                performs during scrolling. The animation should remain smooth
                and responsive.
              </p>
              <div className='space-y-2 text-sm text-gray-600'>
                <p>• Check for smooth scrolling</p>
                <p>• Monitor frame rate during animation</p>
                <p>• Test touch responsiveness</p>
                <p>• Verify text readability</p>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                Mobile Optimization
              </h3>
              <p className='text-gray-700 mb-4'>
                This section tests mobile-specific features and optimizations
                for the fluid animation.
              </p>
              <div className='space-y-2 text-sm text-gray-600'>
                <p>• Touch event handling</p>
                <p>• Responsive design</p>
                <p>• Performance on mobile devices</p>
                <p>• Battery consumption</p>
              </div>
            </div>
          </div>

          <div className='mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
            <h3 className='text-xl font-semibold text-gray-800 mb-4'>
              Additional Testing Content
            </h3>
            <p className='text-gray-700 mb-4'>
              This additional content helps test scrolling behavior and ensures
              the fluid animation doesn't interfere with normal page navigation
              and content consumption.
            </p>
            <div className='grid md:grid-cols-3 gap-4 text-sm text-gray-600'>
              <div>
                <h4 className='font-semibold text-gray-800 mb-2'>Feature 1</h4>
                <p>
                  Test smooth scrolling with fluid animations in the background.
                </p>
              </div>
              <div>
                <h4 className='font-semibold text-gray-800 mb-2'>Feature 2</h4>
                <p>
                  Verify touch interactions work properly on mobile devices.
                </p>
              </div>
              <div>
                <h4 className='font-semibold text-gray-800 mb-2'>Feature 3</h4>
                <p>
                  Ensure text remains readable across different backgrounds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

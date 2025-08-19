'use client';
import React, { useState } from 'react';

import TextBlockWithSplash from '../../components/TextBlockWithSplash';

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

export default function TextBlockSplashDemo() {
  const [currentExample, setCurrentExample] = useState(0);
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  const examples = [
    {
      title: 'Welcome to Fluid Text',
      content:
        'This is a beautiful text block with interactive fluid animations. Move your mouse around to see the magic happen! The fluid simulation creates stunning visual effects that respond to your cursor movements.',
      splashProps: {
        BACK_COLOR: hexToRgb('#FE3ED8'), // Pink/magenta
        COLOR_UPDATE_SPEED: 10,
        SPLAT_RADIUS: 0.2,
        colorPalette: [
          hexToRgb('#FE3ED8'), // Pink/magenta
          hexToRgb('#F6C2A4'), // Peach/salmon
          hexToRgb('#F8FEC1'), // Light yellow/cream
        ],
      },
    },
    {
      title: 'Peach Dreams',
      content:
        'Experience the warm, soothing tones of peach and cream. This gentle color palette creates a calming and inviting atmosphere with soft fluid movements.',
      splashProps: {
        BACK_COLOR: hexToRgb('#F6C2A4'), // Peach/salmon
        COLOR_UPDATE_SPEED: 5,
        SPLAT_RADIUS: 0.3,
        DENSITY_DISSIPATION: 2.5,
        colorPalette: [
          hexToRgb('#F6C2A4'), // Peach/salmon
          hexToRgb('#FE3ED8'), // Pink/magenta
          hexToRgb('#F8FEC1'), // Light yellow/cream
        ],
      },
    },
    {
      title: 'Cream Flow',
      content:
        'Dive into the light and airy world of cream-colored fluid animations. The subtle, elegant movements create a sophisticated and refined visual experience.',
      splashProps: {
        BACK_COLOR: hexToRgb('#F8FEC1'), // Light yellow/cream
        COLOR_UPDATE_SPEED: 15,
        SPLAT_RADIUS: 0.15,
        SPLAT_FORCE: 8000,
        colorPalette: [
          hexToRgb('#F8FEC1'), // Light yellow/cream
          hexToRgb('#FE3ED8'), // Pink/magenta
          hexToRgb('#F6C2A4'), // Peach/salmon
        ],
      },
    },
    {
      title: 'Pink Aurora',
      content:
        'Sometimes less is more. This minimalist configuration focuses on the vibrant pink tones, creating elegant fluid movements that enhance rather than distract from the content.',
      splashProps: {
        BACK_COLOR: hexToRgb('#FE3ED8'), // Pink/magenta
        COLOR_UPDATE_SPEED: 3,
        SPLAT_RADIUS: 0.1,
        DENSITY_DISSIPATION: 4,
        VELOCITY_DISSIPATION: 3,
        colorPalette: [
          hexToRgb('#FE3ED8'), // Pink/magenta
          hexToRgb('#F6C2A4'), // Peach/salmon
          hexToRgb('#F8FEC1'), // Light yellow/cream
        ],
      },
    },
  ];

  const currentExampleData = examples[currentExample];

  return (
    <div className='min-h-screen bg-white'>
      {/* Navigation */}
      <nav className='fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm'>
        <div className='max-w-6xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-xl font-bold text-gray-800'>
              Text Block with Splash Demo
            </h1>
            <div className='flex gap-2'>
              {examples.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentExample(index)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    currentExample === index
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Example {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Testing Section */}
      <div className='pt-20 pb-8 px-4'>
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
          title={currentExampleData.title}
          content={currentExampleData.content}
          splashProps={currentExampleData.splashProps}
          showSplash={true}
          onToggleSplash={(enabled) => {
            console.log('Splash toggled:', enabled);
          }}
          className='bg-white'
          lightMode={true}
        />
      </div>

      {/* Configuration Info */}
      <div className='fixed bottom-4 left-4 z-40 bg-white/90 backdrop-blur-sm text-gray-800 p-4 rounded-lg max-w-sm border border-gray-200 shadow-lg'>
        <h3 className='font-bold mb-2'>Current Configuration:</h3>
        <div className='text-sm space-y-1'>
          <p>Example: {currentExample + 1}</p>
          <p>
            Back Color: RGB({currentExampleData.splashProps.BACK_COLOR?.r},{' '}
            {currentExampleData.splashProps.BACK_COLOR?.g},{' '}
            {currentExampleData.splashProps.BACK_COLOR?.b})
          </p>
          <p>
            Color Update Speed:{' '}
            {currentExampleData.splashProps.COLOR_UPDATE_SPEED}
          </p>
          <p>Splat Radius: {currentExampleData.splashProps.SPLAT_RADIUS}</p>
          {currentExampleData.splashProps.DENSITY_DISSIPATION && (
            <p>
              Density Dissipation:{' '}
              {currentExampleData.splashProps.DENSITY_DISSIPATION}
            </p>
          )}
          {currentExampleData.splashProps.VELOCITY_DISSIPATION && (
            <p>
              Velocity Dissipation:{' '}
              {currentExampleData.splashProps.VELOCITY_DISSIPATION}
            </p>
          )}
          {currentExampleData.splashProps.SPLAT_FORCE && (
            <p>Splat Force: {currentExampleData.splashProps.SPLAT_FORCE}</p>
          )}
        </div>
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

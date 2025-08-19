'use client';
import React, { useState } from 'react';

import SplashCursor from './splash/SplashCursor';

interface TextBlockWithSplashProps {
  title?: string;
  content: string;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  splashProps?: {
    SIM_RESOLUTION?: number;
    DYE_RESOLUTION?: number;
    CAPTURE_RESOLUTION?: number;
    DENSITY_DISSIPATION?: number;
    VELOCITY_DISSIPATION?: number;
    PRESSURE?: number;
    PRESSURE_ITERATIONS?: number;
    CURL?: number;
    SPLAT_RADIUS?: number;
    SPLAT_FORCE?: number;
    SHADING?: boolean;
    COLOR_UPDATE_SPEED?: number;
    BACK_COLOR?: { r: number; g: number; b: number };
    TRANSPARENT?: boolean;
  };
  showSplash?: boolean;
  onToggleSplash?: (enabled: boolean) => void;
  lightMode?: boolean;
}

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

export default function TextBlockWithSplash({
  title,
  content,
  className = '',
  titleClassName = '',
  contentClassName = '',
  splashProps = {},
  showSplash = true,
  onToggleSplash,
  lightMode = false,
}: TextBlockWithSplashProps) {
  const [isSplashEnabled, setIsSplashEnabled] = useState(showSplash);

  const handleToggleSplash = () => {
    const newState = !isSplashEnabled;
    setIsSplashEnabled(newState);
    onToggleSplash?.(newState);
  };

  // Default colors using the specified hex values
  const defaultBackColor = hexToRgb('#FE3ED8'); // Pink/magenta
  const defaultSplashColors = [
    hexToRgb('#FE3ED8'), // Pink/magenta
    hexToRgb('#F6C2A4'), // Peach/salmon
    hexToRgb('#F8FEC1'), // Light yellow/cream
  ];

  // Text colors based on light/dark mode
  const textColors = lightMode
    ? {
        title: 'text-gray-800',
        content: 'text-gray-700',
        hint: 'text-gray-600',
        button:
          'bg-gray-800/20 backdrop-blur-sm text-gray-800 border-gray-300 hover:bg-gray-800/30',
      }
    : {
        title: 'text-white',
        content: 'text-white/90',
        hint: 'text-white/70',
        button:
          'bg-black/20 backdrop-blur-sm text-white border-white/20 hover:bg-black/30',
      };

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
    >
      {/* Splash Cursor Background */}
      {isSplashEnabled && (
        <div className='absolute inset-0 z-0'>
          <SplashCursor
            SIM_RESOLUTION={splashProps.SIM_RESOLUTION || 128}
            DYE_RESOLUTION={splashProps.DYE_RESOLUTION || 1440}
            CAPTURE_RESOLUTION={splashProps.CAPTURE_RESOLUTION || 512}
            DENSITY_DISSIPATION={splashProps.DENSITY_DISSIPATION || 3.5}
            VELOCITY_DISSIPATION={splashProps.VELOCITY_DISSIPATION || 2}
            PRESSURE={splashProps.PRESSURE || 0.1}
            PRESSURE_ITERATIONS={splashProps.PRESSURE_ITERATIONS || 20}
            CURL={splashProps.CURL || 3}
            SPLAT_RADIUS={splashProps.SPLAT_RADIUS || 0.2}
            SPLAT_FORCE={splashProps.SPLAT_FORCE || 6000}
            SHADING={
              splashProps.SHADING !== undefined ? splashProps.SHADING : true
            }
            COLOR_UPDATE_SPEED={splashProps.COLOR_UPDATE_SPEED || 10}
            BACK_COLOR={splashProps.BACK_COLOR || defaultBackColor}
            TRANSPARENT={true}
          />
        </div>
      )}

      {/* Content Container */}
      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen p-8'>
        {/* Toggle Button */}
        <button
          onClick={handleToggleSplash}
          className={`absolute top-4 right-4 px-4 py-2 rounded-lg border transition-all duration-200 z-20 ${textColors.button}`}
        >
          {isSplashEnabled ? 'Disable Splash' : 'Enable Splash'}
        </button>

        {/* Text Content */}
        <div className='max-w-4xl mx-auto text-center'>
          {title && (
            <h1
              className={`text-5xl md:text-7xl font-bold mb-8 drop-shadow-lg ${
                titleClassName || textColors.title
              }`}
            >
              {title}
            </h1>
          )}

          <div
            className={`text-xl md:text-2xl leading-relaxed drop-shadow-md ${
              contentClassName || textColors.content
            }`}
          >
            {content}
          </div>
        </div>

        {/* Interactive Hint */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-center'>
          {isSplashEnabled && (
            <p
              className={`backdrop-blur-sm px-4 py-2 rounded-lg ${
                lightMode
                  ? 'bg-white/80 text-gray-700'
                  : 'bg-black/20 text-white/70'
              }`}
            >
              {lightMode ? (
                <>
                  <span className='hidden md:inline'>Move your mouse or </span>
                  <span className='md:hidden'>Touch and drag to </span>
                  create fluid animations
                </>
              ) : (
                <>
                  <span className='hidden md:inline'>Move your mouse or </span>
                  <span className='md:hidden'>Touch and drag to </span>
                  create fluid animations
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

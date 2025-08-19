import React from 'react';

interface WaveBackgroundProps {
  className?: string;
  height?: string;
  children?: React.ReactNode;
}

const CircleWaveBackground: React.FC<WaveBackgroundProps> = ({
  className = '',
  children,
}) => {
  // More rounded clip-path polygon with smoother curves
  const clipPath = `polygon(
    0.0% 45.0%, 
    3.0% 48.5%, 
    6.5% 52.0%, 
    10.0% 56.8%, 
    14.0% 62.5%, 
    18.5% 67.0%, 
    23.0% 70.8%, 
    27.5% 73.5%, 
    32.0% 75.2%, 
    36.5% 74.8%, 
    41.0% 72.5%, 
    45.0% 68.0%, 
    48.5% 62.0%, 
    52.0% 54.5%, 
    55.5% 46.0%, 
    59.0% 37.8%, 
    62.5% 30.5%, 
    66.0% 24.2%, 
    69.5% 19.0%, 
    73.0% 15.5%, 
    76.5% 13.8%, 
    80.0% 14.2%, 
    83.5% 16.8%, 
    87.0% 21.5%, 
    90.0% 27.8%, 
    92.5% 35.0%, 
    95.0% 43.2%, 
    97.0% 52.0%, 
    98.5% 58.5%, 
    100.0% 62.8%, 
    100.0% 100.0%, 
    0.0% 100.0%
  )`;

  return (
    <div className='h-screen w-full'>
      <div className={`relative w-full h-full ${className}`}>
        {/* White background space on top that blends naturally */}
        <div className='absolute inset-0 bg-white' />

        <div
          className='absolute inset-0 w-full h-full'
          style={{
            background: `
            linear-gradient(0deg, #FE3ED8 4%, #F6C2A4 12%, transparent 19%)
            `,
            mixBlendMode: 'multiply',
          }}
        />
        <div
          className='absolute inset-0 w-full h-full'
          style={{
            background: `
            radial-gradient(95% 150% at 82% 106%, rgb(254, 62, 216) 12%, rgb(246, 194, 164) 36%, rgb(248, 254, 193) 47%, transparent 62%), radial-gradient(23% 13% at 0% 92%, rgb(254, 62, 216) 20%, rgb(246, 194, 164) 54%, rgb(248, 254, 193) 175%, transparent 44%)
            `,
            mixBlendMode: 'multiply',
            // clipPath: clipPath,
            // WebkitClipPath: clipPath, // Safari compatibility
            filter: 'blur(10px)',
          }}
        />
        {/* Content overlay (optional) */}
        {children && <div className='relative z-10 h-full'>{children}</div>}
      </div>
    </div>
  );
};

export default CircleWaveBackground;

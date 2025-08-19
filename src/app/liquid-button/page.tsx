'use client';
import React from 'react';
import LiquidButton from '@/components/LiquidButton';

export default function LiquidButtonPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center'>
      <div className='text-center space-y-8'>
        <h1 className='text-4xl font-bold text-white mb-8'>
          Liquid Button Effect
        </h1>

        <div className='space-y-6'>
          <LiquidButton onClick={() => alert('Button clicked!')}>
            Hover Me for Liquid Effect
          </LiquidButton>

          <div className='space-x-4'>
            <LiquidButton onClick={() => console.log('Primary clicked')}>
              Primary Action
            </LiquidButton>

            <LiquidButton onClick={() => console.log('Secondary clicked')}>
              Secondary Action
            </LiquidButton>
          </div>

          <LiquidButton className='text-lg px-8 py-4'>
            Larger Liquid Button
          </LiquidButton>
        </div>
      </div>
    </div>
  );
}

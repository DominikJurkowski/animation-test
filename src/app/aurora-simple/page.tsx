'use client';
import AuroraLiquid from '@/components/AuroraLiquid';

export default function AuroraSimple() {
  return (
    <div className='w-full h-screen'>
      <AuroraLiquid
        colorStops={['#FE3ED8', '#F6C2A4', '#F8FEC1', '#FFFFFF']}
        amplitude={1.0}
      />
    </div>
  );
}

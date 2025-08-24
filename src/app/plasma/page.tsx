'use client';

import Plasma from '@/components/Plasma';

export default function PlasmaPage() {
  return (
    <div className='w-screen h-screen'>
      <Plasma
        color={['#FE3ED8', '#F6C2A4', '#F8FEC1']}
        speed={0.6}
        direction='forward'
        scale={1.1}
        opacity={0.8}
        mouseInteractive={false}
      />
    </div>
  );
}

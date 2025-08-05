import GradientBackground from '@/components/GradientBackground';

export default function AnimationPage() {
  return (
    <div>
      {/* <FluidGradientBlob /> */}
      <GradientBackground>
        {/* Your custom content here */}
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>
            Custom Content
          </h1>
          <p className='text-gray-600 max-w-md'>
            This gradient background component can wrap any content you want to
            display.
          </p>
        </div>
      </GradientBackground>
    </div>
  );
}

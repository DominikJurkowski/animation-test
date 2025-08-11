import ShinyText from '@/components/text/ShinyText';

export default function TextDemoPage() {
  return (
    <div className='min-h-screen bg-white p-8'>
      <div className='max-w-6xl mx-auto space-y-12'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>
            ShinyText Examples
          </h1>
          <p className='text-gray-600'>
            Three different ways to use the ShinyText component
          </p>
        </div>

        {/* Example 1: Normal Text */}
        <div className='bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            1. Normal Text Example
          </h2>
          <div className='space-y-6'>
            <div>
              <ShinyText
                text='This is a beautiful shiny text effect!'
                className='text-4xl font-bold'
              />
            </div>
            <div>
              <ShinyText
                text='You can adjust the speed and styling'
                speed={3}
                className='text-2xl'
              />
            </div>
            <div>
              <ShinyText
                text='Disabled state example'
                disabled={true}
                className='text-xl opacity-50'
              />
            </div>
            <div className='bg-black rounded-lg p-4'>
              <ShinyText
                text='Shiny text on dark background'
                speed={2}
                className='text-xl font-semibold'
              />
            </div>
          </div>
        </div>

        {/* Example 2: Button */}
        <div className='bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            2. Button Example
          </h2>
          <div className='space-y-4'>
            <button className='bg-black hover:bg-gray-800 transition-colors duration-300 px-8 py-4 rounded-lg shadow-lg'>
              <ShinyText
                text='Click Me!'
                speed={2}
                className='text-lg font-semibold'
              />
            </button>
            <button className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 px-8 py-4 rounded-lg shadow-lg'>
              <ShinyText
                text='Gradient Button'
                speed={1.5}
                className='text-lg font-semibold'
              />
            </button>
          </div>
        </div>

        {/* Example 3: Card with Photo */}
        <div className='bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            3. Card with Photo Example
          </h2>
          <div className='bg-white rounded-lg overflow-hidden border border-gray-200 shadow-lg'>
            {/* Placeholder Image */}
            <div className='w-full h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center'>
              <div className='text-white text-center'>
                <div className='text-6xl mb-2'>📸</div>
                <p className='text-sm opacity-75'>Photo Placeholder</p>
              </div>
            </div>

            {/* Card Content */}
            <div className='p-6'>
              <ShinyText
                text='Amazing Photo Title'
                className='text-2xl font-bold mb-2'
              />
              <p className='text-gray-600 mb-4'>
                This is a beautiful card with a photo and shiny text title. The
                gradient colors create an eye-catching effect that draws
                attention to the content.
              </p>
              <div className='flex gap-3'>
                <button className='bg-purple-600 hover:bg-purple-700 transition-colors duration-300 px-4 py-2 rounded text-white text-sm'>
                  View Details
                </button>
                <button className='bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors duration-300 px-4 py-2 rounded text-sm'>
                  <ShinyText text='Learn More' speed={4} className='text-sm' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import ImageTrailComponent from '@/components/image/ImageTrail';

export default function ImageTrailPage() {
  const images = [
    '/images/trail/pic1.png',
    '/images/trail/pic2.png',
    '/images/trail/pic3.png',
    '/images/trail/pic4.png',
    '/images/trail/pic5.png',
    '/images/trail/pic6.png',
    '/images/trail/pic7.png',
    '/images/trail/pic8.png',
    '/images/trail/pic9.png',
    '/images/trail/pic10.png',
    '/images/trail/pic11.png',
  ];
  return (
    <div className='h-screen relative overflow-hidden'>
      <ImageTrailComponent key='ImageTrail' items={images} />
    </div>
  );
}

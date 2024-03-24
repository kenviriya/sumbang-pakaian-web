import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

export function Carousel() {
  const [emblaRef] = useEmblaCarousel({loop: true}, [Autoplay('delay = 5000')]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        <div className="embla__slide">
          <Image
            src={'/carousel-1.jpg'}
            alt={'image-1'}
            width={1920}
            height={1080}
          />
        </div>
        <div className="embla__slide">
          <Image
            src={'/carousel-2.jpg'}
            alt={'image-2'}
            width={1920}
            height={1080}
          />
        </div>
        <div className="embla__slide">
          <Image
            src={'/carousel-3.jpg'}
            alt={'image-3'}
            width={1920}
            height={1080}
          />
        </div>
      </div>
    </div>
  );
}

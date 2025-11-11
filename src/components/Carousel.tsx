import React from 'react';
import Slider from 'react-slick';
import { CarouselProps, Slide } from '../types';

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true
  };

  return (
    <div className="container mx-auto">
      <Slider {...settings}>
        {slides.map(slide => (
          <div key={slide.id}>
            <img src={slide.image} alt={slide.alt} className="w-full h-auto object-cover rounded-lg" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
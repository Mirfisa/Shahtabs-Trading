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
    <div className="relative">
      <Slider {...settings}>
        {slides.map(slide => (
          <div key={slide.id} className="relative">
            <img src={slide.image} alt={slide.alt} className="w-full h-[500px] object-cover" />
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>
        ))}
      </Slider>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-4xl font-bold md:text-6xl">
          GET YOUR DREAM CAR FROM JAPAN!
        </h1>
        <p className="mt-4 text-lg">
          Pre-order | Ready Stock | Wholesale | Retail
        </p>
        <div className="mt-8">
          <a
            href="/"
            className="px-8 py-3 text-lg font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
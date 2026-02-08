import React from 'react';
import Slider from 'react-slick';
import { CarouselProps } from '../types';

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute top-0 right-0 z-10 w-1/2 h-full cursor-pointer"
      onClick={onClick}
    />
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute top-0 left-0 z-10 w-1/2 h-full cursor-pointer"
      onClick={onClick}
    />
  );
};

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    adaptiveHeight: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <div className="relative">
      <Slider {...settings} className="hero-carousel">
        {slides.map((slide, index) => (
          <div key={slide.id} className="relative">
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-[500px] object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              {...(index === 0 ? { fetchPriority: "high" } : {})}
            />
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>
        ))}
      </Slider>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-3xl font-bold md:text-5xl">
          GET YOUR DREAM CAR FROM JAPAN!
        </h1>
        <p className="mt-4 text-base">
          Pre-order | Ready Stock | Wholesale | Retail
        </p>
      </div>
    </div>
  );
};

export default Carousel;

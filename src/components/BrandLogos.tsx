import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const brands = [
  'toyota.png',
  'honda.png',
  'nissan.png',
  'suzuki.png',
  'mitsubishi.png',
  'subaru.png',
  'mazda.png',
  'lexus.png',
];

const BrandLogos: React.FC = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="bg-white py-4 my-4 shadow-md overflow-hidden">
      <div className="container mx-auto px-4">
        <Slider {...settings}>
          {brands.map((brand, index) => (
            <div key={index} className="px-2 focus:outline-none">
              <div className="flex items-center justify-center h-20">
                <img
                  src={`${process.env.PUBLIC_URL}/brands/${brand}`}
                  alt={brand.split('.')[0]}
                  className="h-12 md:h-16 object-contain transition duration-300 hover:scale-110 cursor-grab active:cursor-grabbing"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BrandLogos;
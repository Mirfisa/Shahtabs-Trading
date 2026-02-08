import React from 'react';
import Carousel from './Carousel';
import BrandLogos from './BrandLogos';
import AboutUs from './AboutUs';
import BookingForm from './BookingForm';
import { Slide } from '../types';

const slides: Slide[] = [
  {
    id: 1,
    image: `${import.meta.env.BASE_URL}cars/images_toyota_corolla_2006_1.jpg`,
    alt: "Toyota Corolla 2006"
  },
  {
    id: 2,
    image: `${import.meta.env.BASE_URL}cars/photos_toyota_hiace_2013_1.jpg`,
    alt: "Toyota Hiace 2013"
  },
  {
    id: 3,
    image: `${import.meta.env.BASE_URL}cars/toyota_alphard_2012_wallpapers_1.jpg`,
    alt: "Toyota Alphard 2012"
  },
  {
    id: 4,
    image: `${import.meta.env.BASE_URL}cars/toyota_land-cruiser-prado_2013_6.jpg`,
    alt: "Toyota Land Cruiser Prado 2013"
  },
  {
    id: 5,
    image: `${import.meta.env.BASE_URL}cars/toyota_noah_2010_images_4.jpg`,
    alt: "Toyota Noah 2010"
  },
];

const Home: React.FC = () => {
  return (
    <main>
      <Carousel slides={slides} />
      <BrandLogos />
      <AboutUs />
      <BookingForm />
    </main>
  );
};

export default Home;

import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';

interface ImageGalleryProps {
    images: string[];
    altText: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, altText }) => {
    const [nav1, setNav1] = useState<Slider | null>(null);
    const [nav2, setNav2] = useState<Slider | null>(null);
    let sliderRef1 = useRef<Slider>(null);
    let sliderRef2 = useRef<Slider>(null);

    useEffect(() => {
        setNav1(sliderRef1.current);
        setNav2(sliderRef2.current);
    }, []);

    // Filter out empty URLs
    const validImages = images.filter(url => url && url.trim() !== '');

    // Fallback if no valid images
    if (validImages.length === 0) {
        return (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-500 text-lg">No images available</span>
            </div>
        );
    }

    const mainSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        swipe: true,
        asNavFor: nav2 || undefined,
        adaptiveHeight: true,
    };

    const thumbSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: Math.min(validImages.length, 6), // Show up to 6 thumbnails
        slidesToScroll: 1,
        focusOnSelect: true,
        asNavFor: nav1 || undefined,
        arrows: false,
        centerMode: false,
        variableWidth: true,
        swipeToSlide: true,
    };



    return (
        <div className="w-full">
            {/* Main Image Slider */}
            <div className="mb-4 bg-black rounded-lg overflow-hidden">
                <Slider {...mainSettings} ref={sliderRef1}>
                    {validImages.map((url, index) => (
                        <div key={index} className="outline-none">
                            <div className="flex items-center justify-center h-[50vh] md:h-[70vh] bg-black">
                                <img
                                    src={url}
                                    alt={`${altText} - ${index + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Thumbnail Slider */}
            {validImages.length > 1 && (
                <div className="px-2">
                    <Slider {...thumbSettings} ref={sliderRef2} className="thumbnail-slider">
                        {validImages.map((url, index) => (
                            <div key={index} className="px-1 outline-none">
                                <div className="w-24 h-16 cursor-pointer bg-gray-200 rounded-md overflow-hidden border-2 border-transparent hover:border-orange-500 box-border">
                                    <img
                                        src={url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;

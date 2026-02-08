import React, { useState } from 'react';

interface ImageGalleryProps {
    images: string[];
    altText: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, altText }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

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

    // If only one image, show simple view
    if (validImages.length === 1) {
        return (
            <img
                src={validImages[0]}
                alt={altText}
                className="w-full h-96 object-cover rounded-t-lg"
            />
        );
    }

    return (
        <div className="w-full">
            {/* Main Image */}
            <div className="relative w-full h-96 bg-gray-100 rounded-t-lg overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="animate-pulse text-gray-500">Loading...</div>
                    </div>
                )}
                <img
                    src={validImages[selectedIndex]}
                    alt={`${altText} - Image ${selectedIndex + 1}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                />

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                    {selectedIndex + 1} / {validImages.length}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={() => {
                        setIsLoading(true);
                        setSelectedIndex(prev => prev === 0 ? validImages.length - 1 : prev - 1);
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                    aria-label="Previous image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={() => {
                        setIsLoading(true);
                        setSelectedIndex(prev => prev === validImages.length - 1 ? 0 : prev + 1);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                    aria-label="Next image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 p-3 bg-gray-50 overflow-x-auto">
                {validImages.map((url, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (index !== selectedIndex) {
                                setIsLoading(true);
                                setSelectedIndex(index);
                            }
                        }}
                        className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all ${index === selectedIndex
                                ? 'border-orange-500 ring-2 ring-orange-300'
                                : 'border-transparent hover:border-gray-300'
                            }`}
                    >
                        <img
                            src={url}
                            alt={`${altText} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;

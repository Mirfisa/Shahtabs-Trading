import React, { useState } from 'react';

interface CarCardImageProps {
    driveImages: string;  // Pipe-separated URLs
    fallbackImage: string;
    altText: string;
}

/**
 * Smart image component that tries multiple images if one fails.
 * Automatically skips broken images (documents, PDFs, etc.)
 */
const CarCardImage: React.FC<CarCardImageProps> = ({ driveImages, fallbackImage, altText }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasError, setHasError] = useState(false);

    // Parse pipe-separated URLs
    const imageUrls = driveImages
        ? driveImages.split('|').map(url => url.trim()).filter(url => url.startsWith('http'))
        : [];

    // Add fallback at the end
    const allUrls = [...imageUrls, fallbackImage].filter(Boolean);

    const handleError = () => {
        // Try next image
        if (currentIndex < allUrls.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setHasError(true);
        }
    };

    if (hasError || allUrls.length === 0) {
        return (
            <div className="w-full h-40 md:h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Image</span>
            </div>
        );
    }

    return (
        <img
            src={allUrls[currentIndex]}
            alt={altText}
            className="w-full h-40 md:h-48 object-cover"
            onError={handleError}
        />
    );
};

export default CarCardImage;

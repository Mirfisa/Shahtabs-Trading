import React, { useState, useEffect } from 'react';

interface CarCardImageProps {
    driveImages: string;  // Pipe-separated URLs
    fallbackImage: string;
    altText: string;
}

/**
 * Smart image component that tries multiple images if one fails.
 * Automatically skips broken images and retries occasional Google Drive 403 blocks.
 * Uses a sleek shimmer skeleton while aggressively loading images concurrently.
 */
const CarCardImage: React.FC<CarCardImageProps> = ({ driveImages, fallbackImage, altText }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Parse pipe-separated URLs
    const imageUrls = driveImages
        ? driveImages.split('|').map(url => url.trim()).filter(url => url.startsWith('http'))
        : [];

    // Add fallback at the end
    const allUrls = [...imageUrls, fallbackImage].filter(Boolean);

    useEffect(() => {
        // Reset state if image sources completely change (like navigating pages)
        setCurrentIndex(0);
        setHasError(false);
        setIsLoaded(false);
        setRetryCount(0);
    }, [driveImages, fallbackImage]);

    const handleError = () => {
        if (retryCount < 2) {
            // Google Drive often temporarily blocks requests if you fetch 9 at the same time.
            // A quick re-request usually works instantly.
            setTimeout(() => {
                setRetryCount(prev => prev + 1);
            }, 300);
        } else if (currentIndex < allUrls.length - 1) {
            // Try next image entirely
            setCurrentIndex(prev => prev + 1);
            setRetryCount(0); // reset retry for the next one
        } else {
            // All options failed
            setHasError(true);
        }
    };

    const handleLoad = () => {
        setIsLoaded(true);
    };

    if (hasError || allUrls.length === 0) {
        return (
            <div className="w-full h-40 md:h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Image</span>
            </div>
        );
    }

    // Append a retry parameter to bust any browser-level broken cache on retry
    const currentSrc = allUrls[currentIndex];
    const srcWithRetry = retryCount > 0
        ? `${currentSrc}${currentSrc.includes('?') ? '&' : '?'}retry=${retryCount}`
        : currentSrc;

    return (
        <div className="w-full h-40 md:h-48 relative overflow-hidden bg-gray-200">
            {/* Shimmer Skeleton - Shows while the image is downloading to reduce perceived wait time */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
                    {/* Optional: Add a subtle loading spinner or icon here if needed */}
                </div>
            )}

            <img
                src={srcWithRetry}
                alt={altText}
                className={`w-full h-full object-cover transition-opacity duration-300 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onError={handleError}
                onLoad={handleLoad}
                // @ts-ignore
                fetchpriority="high"
                referrerPolicy="no-referrer"
            />
        </div>
    );
};

export default CarCardImage;

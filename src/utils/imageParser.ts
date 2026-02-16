export const processDriveUrl = (url: string): string => {
    if (!url) return '';

    let id = null;
    // Handle drive.google.com/file/d/ID/view
    if (url.includes('drive.google.com/file/d/')) {
        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match) id = match[1];
    }
    // Handle drive.google.com/open?id=ID
    else if (url.includes('open?id=')) {
        const match = url.match(/id=([a-zA-Z0-9_-]+)/);
        if (match) id = match[1];
    }

    if (id) {
        // Generate direct thumbnail link using lh3.googleusercontent.com (more reliable than drive.google.com/thumbnail)
        return `https://lh3.googleusercontent.com/d/${id}=w1000`;
    }

    return url;
};

export const parseImageField = (fieldContent: string): string[] => {
    if (!fieldContent) return [];

    // Split by newline, comma, pipe, or space
    // Filter for valid http links
    // Process drive URLs
    return fieldContent
        .split(/[\n, |]+/)
        .map(url => url.trim())
        .filter(url => url.startsWith('http'))
        .map(processDriveUrl);
};

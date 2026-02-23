const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;
const Papa = require('papaparse');
require('dotenv').config();

// Initialize Firebase Admin (Using Service Account JSON from env var for GitHub Actions compatibility)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Initialize Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1ewIpPg69jB4lXGKfdPuS2e0jPsVVEVyrsUARTlcYPmI/export?format=csv';

// Helper to convert complex Drive URLs to standard viewable URLs before passing to Cloudinary
const extractDriveId = (url) => {
    if (!url) return null;
    let match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) match = url.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
};

const getDirectDriveLink = (url) => {
    const id = extractDriveId(url);
    if (id) {
        // High quality download link from Drive used by Cloudinary fetch
        return `https://drive.google.com/uc?export=download&id=${id}`;
    }
    return url;
};

const parseImageField = (fieldContent) => {
    if (!fieldContent) return [];
    return fieldContent
        .split(/[\n, |]+/)
        .map(url => url.trim())
        .filter(url => url.startsWith('http'))
        .map(url => getDirectDriveLink(url));
};

// Uploads a single image to Cloudinary and returns the optimized WebP URL
const uploadToCloudinary = async (uniqueId, imageUrl, index) => {
    try {
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: `shahtabs_cars/${uniqueId}`,
            public_id: `image_${index}`,
            overwrite: true,
            format: 'webp',
            transformation: [
                { width: 1920, height: 1080, crop: "limit" }, // Max 1080p equivalent
                { quality: "auto:eco" }, // Automatic smart compression
                { fetch_format: "auto" }
            ]
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Failed to upload ${imageUrl} to Cloudinary:`, error.message);
        return null; // Return null if Google Drive blocks the fetch
    }
};

async function syncData() {
    console.log("Starting Sync Process...");

    // 1. Fetch CSV from Google Sheets
    console.log("Fetching latest Google Sheet data...");
    const response = await fetch(SHEET_URL);
    if (!response.ok) throw new Error('Failed to fetch Google Sheet data');
    const csvData = await response.text();

    const parsedData = Papa.parse(csvData, { header: true }).data;
    console.log(`Parsed ${parsedData.length} rows from Google Sheets.`);

    // 2. Process Data
    const carsToUpdate = [];
    const uniqueCarsMap = new Map();

    for (const car of parsedData) {
        const serialNumber = car['S.N.'];
        if (!serialNumber || serialNumber.trim() === '') continue;

        if (!uniqueCarsMap.has(serialNumber)) {
            uniqueCarsMap.set(serialNumber, car);
        }
    }

    const uniqueCars = Array.from(uniqueCarsMap.values());
    console.log(`Found ${uniqueCars.length} unique valid cars.`);

    for (const car of uniqueCars) {
        const serialNumber = car['S.N.'].trim();
        const docRef = db.collection('cars').doc(serialNumber);
        const docSnapshot = await docRef.get();

        const allImagesRaw = car['All Images'] || '';
        const rawAppractedUrls = parseImageField(allImagesRaw);

        let shouldUploadImages = false;
        let existingCloudinaryUrls = [];

        if (docSnapshot.exists) {
            const dbData = docSnapshot.data();
            existingCloudinaryUrls = dbData.optimizedImages || [];

            // Very basic diff: If the sheet has a different number of raw images than what is in Cloudinary
            // For production, we could hash the URLs or implement a forced sync flag in the sheet.
            if (rawAppractedUrls.length > 0 && existingCloudinaryUrls.length !== rawAppractedUrls.length) {
                console.log(`[${serialNumber}] Image count mismatch. Re-syncing images...`);
                shouldUploadImages = true;
            } else {
                console.log(`[${serialNumber}] No image changes detected. Skipping upload.`);
            }
        } else {
            console.log(`[${serialNumber}] New car detected. Syncing images...`);
            shouldUploadImages = true;
        }

        let newOptimizedUrls = existingCloudinaryUrls;

        if (shouldUploadImages && rawAppractedUrls.length > 0) {
            newOptimizedUrls = [];
            // Upload sequentially to avoid aggressive Rate Limiting from Cloudinary or Google Drive
            for (let i = 0; i < Math.min(rawAppractedUrls.length, 12); i++) { // Cap at 12 images per car for API safety
                const optimizedUrl = await uploadToCloudinary(serialNumber, rawAppractedUrls[i], i);
                if (optimizedUrl) {
                    newOptimizedUrls.push(optimizedUrl);
                }
            }
        }

        // Prepare the final structured document
        const carDocument = {
            serialNumber: serialNumber,
            name: car['Car Name'] || '',
            modelYear: car['Model'] || '',
            chassisNumber: car['Chasis Number'] || '',
            color: car['Colour'] || '',
            mileage: car['Mileage'] || '',
            engine: car['Engine'] || '',
            grade: car['Grade'] ? car['Grade'].trim() : '',
            details: car['Details'] || '',
            price: car['Price'] ?? car['Landing'] ?? '',
            status: car['Status'] || '',
            landing: car['Landing'] || '',
            location: car['Location'] || '',
            optimizedImages: newOptimizedUrls, // The shiny new Cloudinary webp URLs
            lastSynced: admin.firestore.FieldValue.serverTimestamp()
        };

        carsToUpdate.push(carDocument);
    }

    // 3. Batch write to Firestore
    console.log(`Batch updating ${carsToUpdate.length} cars to Firestore...`);
    const batch = db.batch();

    carsToUpdate.forEach(car => {
        const docRef = db.collection('cars').doc(car.serialNumber);
        batch.set(docRef, car, { merge: true });
    });

    await batch.commit();
    console.log("Sync Complete!");
}

syncData().catch(console.error).finally(() => process.exit(0));

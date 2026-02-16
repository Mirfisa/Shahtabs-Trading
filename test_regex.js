const fs = require('fs');

const processDriveUrl = (url) => {
    let id = null;
    if (url.includes('/file/d/')) {
        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match) id = match[1];
    } else if (url.includes('open?id=')) {
        const match = url.match(/id=([a-zA-Z0-9_-]+)/);
        if (match) id = match[1];
    }

    if (id) {
        return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    }
    return url;
};

// Mock data from CSV line 2
// Note: This string mimics the raw CSV quoted string content
const rawAllImages = `https://drive.google.com/file/d/1Zgh6MmPA_MvLDOxpRT6TrDP8ZrCSZvt0/view?usp=drivesdk 
https://drive.google.com/file/d/183DraCxSW0KkbMptWW2Wu51RCyfZoThN/view?usp=drivesdk
https://drive.google.com/file/d/1MZ4rgKiYJiEyx0GfcOk3eTqGeOqMCBwW/view?usp=drivesdk
https://drive.google.com/file/d/1b4I3Fy6Ao32Zs5ufI3FjKQibHtBU7vBu/view?usp=drivesdk
https://drive.google.com/file/d/1hoOIKJ1_2xlJx8nmsqhri0bJoWhmz-sH/view?usp=drivesdk
https://drive.google.com/file/d/1mwrF_44wP4CxrbC7dKieaC1rohHiu7Sx/view?usp=drivesdk
https://drive.google.com/file/d/1zzweIipUG3QyVSK6wrPsbWZFJY3qCHKL/view?usp=drivesdk`;

// Test existing split
const split1 = rawAllImages.split(/[\n,]+/).map(u => u.trim()).filter(u => u.startsWith('http'));
console.log("Existing Split Count:", split1.length);
console.log("Existing Split URLs:", split1.map(processDriveUrl));

// Test improved split (adding | and spaces)
const split2 = rawAllImages.split(/[\n,|]+/).map(u => u.trim()).filter(u => u.startsWith('http'));
console.log("Improved Split Count:", split2.length);
console.log("Improved Split URLs:", split2.map(processDriveUrl));

// Test 'open?id=' case (Line 128)
const openIdUrl = `https://drive.google.com/open?id=1klQ2pAq_F7eCwnJ9SMkIZS-V60fwLaBd&usp=drive_copy`;
console.log("Open ID Processed:", processDriveUrl(openIdUrl));

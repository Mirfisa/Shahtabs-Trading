"""
Google Drive Folder Image Extractor
====================================
Extracts all image thumbnail URLs from a public Google Drive folder.

Usage:
    python extract_drive_images.py "https://drive.google.com/drive/folders/YOUR_FOLDER_ID"

Output:
    Pipe-separated thumbnail URLs ready to paste into your spreadsheet.

Requirements:
    pip install requests
"""

import sys
import re
import requests

def extract_folder_id(url: str) -> str:
    """Extract folder ID from various Google Drive URL formats."""
    # Pattern: /folders/FOLDER_ID or id=FOLDER_ID
    patterns = [
        r'/folders/([a-zA-Z0-9_-]+)',
        r'id=([a-zA-Z0-9_-]+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return url  # Assume it's already just the ID

def get_file_ids_from_folder(folder_id: str) -> list:
    """Fetch the folder page and extract all file IDs."""
    # Use the embed view which is simpler to parse
    url = f"https://drive.google.com/embeddedfolderview?id={folder_id}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching folder: {e}", file=sys.stderr)
        return []
    
    html = response.text
    
    # Extract file IDs from the HTML
    # Pattern matches file IDs in various contexts
    file_id_pattern = r'https://drive\.google\.com/file/d/([a-zA-Z0-9_-]+)'
    file_ids = list(set(re.findall(file_id_pattern, html)))
    
    # Also try alternate pattern for thumbnails
    thumb_pattern = r'https://drive\.google\.com/thumbnail\?id=([a-zA-Z0-9_-]+)'
    thumb_ids = list(set(re.findall(thumb_pattern, html)))
    
    # Also look for file IDs in data attributes
    data_pattern = r'"([a-zA-Z0-9_-]{25,})"'
    potential_ids = re.findall(data_pattern, html)
    
    # Combine and deduplicate
    all_ids = list(set(file_ids + thumb_ids))
    
    # If we didn't find any with the standard patterns, try the data pattern
    # but filter to likely file IDs (typically 28-44 chars, alphanumeric with - and _)
    if not all_ids and potential_ids:
        all_ids = [id for id in potential_ids if 25 <= len(id) <= 50]
    
    return all_ids

def generate_thumbnail_urls(file_ids: list, size: int = 1000) -> list:
    """Generate thumbnail URLs from file IDs."""
    return [
        f"https://drive.google.com/thumbnail?id={file_id}&sz=w{size}"
        for file_id in file_ids
    ]

def main():
    if len(sys.argv) < 2:
        print("Usage: python extract_drive_images.py <folder_url>")
        print("Example: python extract_drive_images.py https://drive.google.com/drive/folders/abc123")
        sys.exit(1)
    
    folder_url = sys.argv[1]
    folder_id = extract_folder_id(folder_url)
    
    print(f"Extracting images from folder: {folder_id}", file=sys.stderr)
    
    file_ids = get_file_ids_from_folder(folder_id)
    
    if not file_ids:
        print("No images found. Make sure the folder is shared as 'Anyone with link can view'.", file=sys.stderr)
        sys.exit(1)
    
    thumbnail_urls = generate_thumbnail_urls(file_ids)
    
    print(f"\nFound {len(thumbnail_urls)} images:", file=sys.stderr)
    print(file=sys.stderr)
    
    # Output the pipe-separated URLs (ready for spreadsheet)
    result = "|".join(thumbnail_urls)
    print(result)
    
    print(file=sys.stderr)
    print("Copy the above line and paste it into your 'Drive Image' column!", file=sys.stderr)

if __name__ == "__main__":
    main()

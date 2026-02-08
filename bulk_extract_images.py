"""
Bulk Google Drive Image Extractor
==================================
Processes your entire Google Sheet and extracts image URLs from all Drive folders.

Usage:
    python bulk_extract_images.py

Output:
    Creates 'updated_cars.csv' with all image URLs populated in 'Drive Image' column.
    You can then copy-paste the 'Drive Image' column values back to your Google Sheet.

Requirements:
    pip install requests
"""

import csv
import re
import requests
import time
import sys

# Your Google Sheet CSV export URL
SHEET_URL = "https://docs.google.com/spreadsheets/d/1uqwgVOtPtRQErRoRM8D5659b0_4mVZ8eI3hiwzGgYlU/export?format=csv"

def extract_folder_id(url: str) -> str | None:
    """Extract folder ID from various Google Drive URL formats."""
    if not url or not url.strip():
        return None
    
    patterns = [
        r'/folders/([a-zA-Z0-9_-]+)',
        r'id=([a-zA-Z0-9_-]+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def get_file_ids_from_folder(folder_id: str) -> list:
    """Fetch the folder page and extract all file IDs."""
    url = f"https://drive.google.com/embeddedfolderview?id={folder_id}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"    Error fetching folder: {e}")
        return []
    
    html = response.text
    
    # Extract file IDs from the HTML
    file_id_pattern = r'https://drive\.google\.com/file/d/([a-zA-Z0-9_-]+)'
    file_ids = list(set(re.findall(file_id_pattern, html)))
    
    thumb_pattern = r'https://drive\.google\.com/thumbnail\?id=([a-zA-Z0-9_-]+)'
    thumb_ids = list(set(re.findall(thumb_pattern, html)))
    
    all_ids = list(set(file_ids + thumb_ids))
    
    if not all_ids:
        data_pattern = r'"([a-zA-Z0-9_-]{25,})"'
        potential_ids = re.findall(data_pattern, html)
        all_ids = [id for id in potential_ids if 25 <= len(id) <= 50]
    
    return all_ids

def generate_thumbnail_urls(file_ids: list, size: int = 1000) -> str:
    """Generate pipe-separated thumbnail URLs from file IDs."""
    urls = [f"https://drive.google.com/thumbnail?id={fid}&sz=w{size}" for fid in file_ids]
    return "|".join(urls)

def main():
    print("=" * 60)
    print("Bulk Google Drive Image Extractor")
    print("=" * 60)
    print()
    
    # Fetch the sheet
    print("Fetching Google Sheet...")
    try:
        response = requests.get(SHEET_URL, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching sheet: {e}")
        sys.exit(1)
    
    # Parse CSV
    csv_content = response.text
    reader = csv.DictReader(csv_content.splitlines())
    rows = list(reader)
    
    print(f"Found {len(rows)} cars in sheet")
    print()
    
    # Process each row
    updated_rows = []
    processed = 0
    skipped = 0
    
    for i, row in enumerate(rows):
        car_name = row.get('Car Name', 'Unknown')
        drive_url = row.get('Drive Image', '')
        
        # Check if it's a folder URL (not already processed)
        folder_id = extract_folder_id(drive_url)
        
        # Skip if it's already thumbnail URLs or empty
        if not folder_id or 'thumbnail' in drive_url.lower():
            print(f"[{i+1}/{len(rows)}] {car_name[:40]:40} - Skipped (no folder URL)")
            skipped += 1
            updated_rows.append(row)
            continue
        
        print(f"[{i+1}/{len(rows)}] {car_name[:40]:40} - Processing...")
        
        # Extract images from folder
        file_ids = get_file_ids_from_folder(folder_id)
        
        if file_ids:
            thumbnail_urls = generate_thumbnail_urls(file_ids)
            row['Drive Image'] = thumbnail_urls
            print(f"    Found {len(file_ids)} images")
            processed += 1
        else:
            print(f"    No images found")
            skipped += 1
        
        updated_rows.append(row)
        
        # Small delay to avoid rate limiting
        time.sleep(0.5)
    
    # Write updated CSV
    output_file = "updated_cars.csv"
    
    if updated_rows:
        fieldnames = updated_rows[0].keys()
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(updated_rows)
    
    print()
    print("=" * 60)
    print("DONE!")
    print(f"  Processed: {processed} cars")
    print(f"  Skipped:   {skipped} cars")
    print(f"  Output:    {output_file}")
    print()
    print("Next steps:")
    print("  1. Open 'updated_cars.csv' in Excel/Sheets")
    print("  2. Copy the 'Drive Image' column values")
    print("  3. Paste into your Google Sheet")
    print("=" * 60)

if __name__ == "__main__":
    main()

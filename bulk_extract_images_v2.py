"""
Improved Bulk Google Drive Image Extractor
===========================================
Fetches actual image metadata from Drive to filter out non-image files.

Usage:
    python bulk_extract_images_v2.py

Requirements:
    pip install requests
"""

import csv
import re
import requests
import time
import sys

SHEET_URL = "https://docs.google.com/spreadsheets/d/1uqwgVOtPtRQErRoRM8D5659b0_4mVZ8eI3hiwzGgYlU/export?format=csv"

def extract_folder_id(url: str) -> str | None:
    """Extract folder ID from Google Drive URL."""
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

def get_image_ids_from_folder(folder_id: str) -> list:
    """Fetch folder and extract only image file IDs by checking content type."""
    # First get file IDs from the embedded folder view
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
    
    # Extract all potential file IDs
    file_id_pattern = r'https://drive\.google\.com/file/d/([a-zA-Z0-9_-]+)'
    file_ids = list(set(re.findall(file_id_pattern, html)))
    
    thumb_pattern = r'https://drive\.google\.com/thumbnail\?id=([a-zA-Z0-9_-]+)'
    thumb_ids = list(set(re.findall(thumb_pattern, html)))
    
    all_ids = list(set(file_ids + thumb_ids))
    
    if not all_ids:
        data_pattern = r'"([a-zA-Z0-9_-]{25,})"'
        potential_ids = re.findall(data_pattern, html)
        all_ids = [id for id in potential_ids if 25 <= len(id) <= 50]
    
    # Now verify each file is actually an image by checking if thumbnail loads
    valid_image_ids = []
    for file_id in all_ids[:15]:  # Limit to first 15 to avoid too many requests
        thumb_url = f"https://drive.google.com/thumbnail?id={file_id}&sz=w200"
        try:
            # Just do a HEAD request to check content type
            resp = requests.head(thumb_url, headers=headers, timeout=5, allow_redirects=True)
            content_type = resp.headers.get('Content-Type', '')
            if 'image' in content_type.lower():
                valid_image_ids.append(file_id)
        except:
            # If check fails, include it anyway (might still be valid)
            valid_image_ids.append(file_id)
        time.sleep(0.1)  # Small delay
    
    return valid_image_ids

def generate_thumbnail_urls(file_ids: list, size: int = 1000) -> str:
    """Generate pipe-separated thumbnail URLs."""
    urls = [f"https://drive.google.com/thumbnail?id={fid}&sz=w{size}" for fid in file_ids]
    return "|".join(urls)

def main():
    print("=" * 60)
    print("Improved Bulk Image Extractor (v2)")
    print("=" * 60)
    print()
    
    print("Fetching Google Sheet...")
    try:
        response = requests.get(SHEET_URL, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching sheet: {e}")
        sys.exit(1)
    
    csv_content = response.text
    reader = csv.DictReader(csv_content.splitlines())
    rows = list(reader)
    
    print(f"Found {len(rows)} cars in sheet")
    print()
    
    updated_rows = []
    processed = 0
    skipped = 0
    
    for i, row in enumerate(rows):
        car_name = row.get('Car Name', 'Unknown')
        drive_url = row.get('Drive Image', '')
        
        folder_id = extract_folder_id(drive_url)
        
        # Skip if no folder URL or already processed
        if not folder_id or ('thumbnail' in drive_url.lower() and '|' in drive_url):
            print(f"[{i+1}/{len(rows)}] {car_name[:35]:35} - Skipped")
            skipped += 1
            # Keep existing first image if we have one
            if 'First Image' not in row:
                if drive_url and 'thumbnail' in drive_url:
                    row['First Image'] = drive_url.split('|')[0].strip()
                else:
                    row['First Image'] = ''
            updated_rows.append(row)
            continue
        
        print(f"[{i+1}/{len(rows)}] {car_name[:35]:35} - Processing...")
        
        file_ids = get_image_ids_from_folder(folder_id)
        
        if file_ids:
            thumbnail_urls = generate_thumbnail_urls(file_ids)
            row['Drive Image'] = thumbnail_urls
            row['First Image'] = f"https://drive.google.com/thumbnail?id={file_ids[0]}&sz=w1000"
            print(f"    Found {len(file_ids)} verified images")
            processed += 1
        else:
            print(f"    No images found")
            row['First Image'] = ''
            skipped += 1
        
        updated_rows.append(row)
        time.sleep(0.3)
    
    # Ensure First Image column exists
    if updated_rows:
        fieldnames = list(updated_rows[0].keys())
        if 'First Image' not in fieldnames:
            fieldnames.append('First Image')
    
    output_file = "updated_cars_v2.csv"
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
    print("=" * 60)

if __name__ == "__main__":
    main()

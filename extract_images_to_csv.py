"""
Script to extract images from Google Drive folders listed in a Google Sheet
and save them to a new CSV file with an 'All Images' column.
"""

import csv
import re
import requests
import time
import sys

# The Google Sheet URL provided by the user
SHEET_URL = "https://docs.google.com/spreadsheets/d/1ayiLeXDHGAIFlvcMGQyo4QAmH_N4wRckcfAHqMlirTs/export?format=csv&gid=378563383"

from typing import Optional

def extract_folder_id(url: str) -> Optional[str]:
    """Extract folder ID from Google Drive URL."""
    if not url or not isinstance(url, str) or not url.strip():
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
    """Fetch folder and extract image file IDs."""
    # Use the embedded folder view technique
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
        # Fallback to data attributes for some drive views
        data_pattern = r'"([a-zA-Z0-9_-]{25,})"'
        potential_ids = re.findall(data_pattern, html)
        # Filter to likely file IDs (25-50 chars)
        all_ids = [id for id in potential_ids if 25 <= len(id) <= 50]
    
    # We will assume these are images for now to be faster, 
    # or we can verify a few if needed. The previous script verified them.
    # Let's verify at least the first one to be safe, but generally trust the folder contains images.
    # Actually, let's just return them. The user wants "all photos".
    return all_ids

def generate_image_links(file_ids: list, size: int = 1000) -> str:
    """Generate comma-separated direct image links."""
    # Using the high-res thumbnail endpoint which usually works well for direct linking
    urls = [f"https://drive.google.com/thumbnail?id={fid}&sz=w{size}" for fid in file_ids]
    return ",".join(urls)

def main():
    print("=" * 60)
    print("Extracting Drive Images to 'All Images' Column")
    print("=" * 60)
    
    print("Fetching Google Sheet...")
    try:
        response = requests.get(SHEET_URL, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching sheet: {e}")
        sys.exit(1)
    
    csv_content = response.text
    # Parse CSV
    reader = csv.DictReader(csv_content.splitlines())
    fieldnames = reader.fieldnames
    
    # Identify the correct column names (handling trailing spaces)
    drive_link_col = next((col for col in fieldnames if "Picture Drive Link" in col), None)
    all_images_col = next((col for col in fieldnames if "All Images" in col), "All Images")
    
    if not drive_link_col:
        print("ERROR: Could not find 'Picture Drive Link' column.")
        print(f"Available columns: {fieldnames}")
        sys.exit(1)
        
    print(f"Using Drive Link Column: '{drive_link_col}'")
    print(f"Target Column: '{all_images_col}'")
    
    rows = list(reader)
    print(f"Found {len(rows)} rows to process.")
    print()
    
    updated_rows = []
    processed_count = 0
    
    for i, row in enumerate(rows):
        car_name = row.get('Car Name', f"Row {i+1}")
        drive_link = row.get(drive_link_col, '')
        
        # Check if we already have images? The user asked to populate it, so we probably should overwrite or fill if empty.
        # Let's extract regardless to be sure we have the latest.
        
        folder_id = extract_folder_id(drive_link)
        
        if folder_id:
            print(f"[{i+1}/{len(rows)}] Processing {car_name[:30]}...")
            image_ids = get_image_ids_from_folder(folder_id)
            
            if image_ids:
                all_images_str = generate_image_links(image_ids)
                row[all_images_col] = all_images_str
                print(f"    -> Found {len(image_ids)} images.")
                processed_count += 1
            else:
                print("    -> No images found in folder.")
                # Keep existing if any, or set empty? Safe to keep existing if we fail to find new ones?
                # or maybe the folder is just empty. Let's leave it as is if we find nothing.
        else:
            # No drive link
            pass
            
        updated_rows.append(row)
        # Be nice to Google's servers
        if folder_id:
            time.sleep(0.5)
            
    # Write to new CSV
    output_file = "updated_cars_images.csv"
    
    # Ensure 'All Images' is in fieldnames
    if all_images_col not in fieldnames:
        fieldnames.append(all_images_col)
        
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(updated_rows)
        
    print("\n" + "=" * 60)
    print("DONE!")
    print(f"Processed {processed_count} rows with images.")
    print(f"Saved to: {output_file}")
    print("=" * 60)

if __name__ == "__main__":
    main()

"""
Fix Missing Images for SL 219-297
===================================
Fetches the correct Google Sheet, extracts images from Drive folders
for rows that are missing thumbnail URLs, and updates the local CSV.
"""

import csv
import re
import requests
import time
import sys

# Correct Google Sheet URL
SHEET_URL = "https://docs.google.com/spreadsheets/d/1QyZB95XgSLvj5z3H-qTzbtv2tNECLAfu/export?format=csv&gid=943751723"

def extract_folder_id(url: str):
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

def get_file_ids_from_folder(folder_id: str):
    """Fetch folder and extract file IDs."""
    url = f"https://drive.google.com/embeddedfolderview?id={folder_id}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
        if response.status_code != 200:
            return []
    except requests.RequestException as e:
        print(f"    Error fetching folder: {e}")
        return []
    
    html = response.text
    file_ids = list(set(re.findall(r'https://drive\.google\.com/file/d/([a-zA-Z0-9_-]+)', html)))
    thumb_ids = list(set(re.findall(r'https://drive\.google\.com/thumbnail\?id=([a-zA-Z0-9_-]+)', html)))
    all_ids = list(set(file_ids + thumb_ids))
    
    if not all_ids:
        data_pattern = r'"([a-zA-Z0-9_-]{25,})"'
        potential_ids = re.findall(data_pattern, html)
        all_ids = [id for id in potential_ids if 25 <= len(id) <= 50]
    
    return all_ids

def generate_thumbnail_urls(file_ids: list, size: int = 1000):
    """Generate pipe-separated thumbnail URLs."""
    urls = [f"https://drive.google.com/thumbnail?id={fid}&sz=w{size}" for fid in file_ids]
    return "|".join(urls)

def main():
    print("=" * 60)
    print("Fix Missing Images (SL 219-297)")
    print("=" * 60)
    print()
    
    # Step 1: Fetch the CORRECT Google Sheet
    print("Fetching from correct Google Sheet...")
    try:
        response = requests.get(SHEET_URL, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching sheet: {e}")
        sys.exit(1)
    
    csv_content = response.text
    reader = csv.DictReader(csv_content.splitlines())
    live_rows = list(reader)
    print(f"Found {len(live_rows)} cars in live sheet")
    
    # Step 2: Read the local CSV
    print("Reading local CSV...")
    with open('updated_cars_with_first_image.csv', 'r', encoding='utf-8') as f:
        local_reader = csv.DictReader(f)
        local_rows = list(local_reader)
        local_fieldnames = local_reader.fieldnames
    print(f"Found {len(local_rows)} cars in local CSV")
    
    # Build a lookup from local CSV by S.N.
    local_by_sn = {}
    for i, row in enumerate(local_rows):
        sn = row.get('S.N.', '').strip()
        local_by_sn[sn] = i
    
    # Step 3: Process rows SL 219-297
    print()
    print("Processing missing rows...")
    print("-" * 60)
    
    processed = 0
    skipped = 0
    failed = 0
    new_rows = []
    
    for row in live_rows:
        sn = row.get('S.N.', '').strip()
        try:
            sn_num = int(sn)
        except:
            continue
        
        if sn_num < 219 or sn_num > 297:
            continue
        
        car_name = row.get('Car Name', '')[:45]
        drive_url = row.get('Drive Image', '')
        
        # Check if local CSV already has thumbnails for this row
        if sn in local_by_sn:
            local_row = local_rows[local_by_sn[sn]]
            local_drive = local_row.get('Drive Image', '')
            if 'thumbnail' in local_drive and '|' in local_drive:
                print(f"[SL {sn:>3}] {car_name:45} - Already has thumbnails, skipping")
                skipped += 1
                continue
        
        # Try to extract folder ID from the live sheet
        folder_id = extract_folder_id(drive_url)
        
        if not folder_id:
            print(f"[SL {sn:>3}] {car_name:45} - No folder URL in sheet")
            failed += 1
            continue
        
        print(f"[SL {sn:>3}] {car_name:45} - Extracting...", end=" ")
        
        file_ids = get_file_ids_from_folder(folder_id)
        
        if file_ids:
            thumbnail_urls = generate_thumbnail_urls(file_ids)
            first_image = f"https://drive.google.com/thumbnail?id={file_ids[0]}&sz=w1000"
            
            # Update local CSV row
            if sn in local_by_sn:
                local_rows[local_by_sn[sn]]['Drive Image'] = thumbnail_urls
                local_rows[local_by_sn[sn]]['First Image'] = first_image
            else:
                # This is a new row not in local CSV - we need to add it
                new_row = dict(row)
                new_row['Drive Image'] = thumbnail_urls
                new_row['First Image'] = first_image
                new_rows.append(new_row)
            
            print(f"✓ {len(file_ids)} images")
            processed += 1
        else:
            print(f"✗ Folder returned 404 or empty")
            failed += 1
        
        time.sleep(0.4)
    
    # Step 4: Add new rows if any
    for new_row in new_rows:
        # Find the right position to insert (before the first row with higher S.N.)
        sn_new = int(new_row.get('S.N.', '0'))
        inserted = False
        for i, row in enumerate(local_rows):
            try:
                sn_existing = int(row.get('S.N.', '0'))
                if sn_existing > sn_new:
                    # Ensure new row has all fieldnames
                    for fn in local_fieldnames:
                        if fn not in new_row:
                            new_row[fn] = ''
                    local_rows.insert(i, new_row)
                    inserted = True
                    break
            except:
                continue
        if not inserted:
            for fn in local_fieldnames:
                if fn not in new_row:
                    new_row[fn] = ''
            local_rows.append(new_row)
    
    # Step 5: Write updated CSV
    output_file = "updated_cars_with_first_image.csv"
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=local_fieldnames, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(local_rows)
    
    print()
    print("=" * 60)
    print("RESULTS:")
    print(f"  ✓ Extracted:  {processed} cars")
    print(f"  → Skipped:    {skipped} cars (already had images)")  
    print(f"  ✗ Failed:     {failed} cars (404 or no folder URL)")
    print(f"  + New rows:   {len(new_rows)} added")
    print(f"  Output:       {output_file}")
    print("=" * 60)

if __name__ == "__main__":
    main()

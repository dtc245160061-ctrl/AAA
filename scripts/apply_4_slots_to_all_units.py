import json
import os
import sys
import re
import shutil
import zipfile
from collections import defaultdict

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    data_path = os.path.join(root_dir, 'data', 'mock_units_1700.json')
    mock_data_path = os.path.join(root_dir, 'src', 'data', 'mockData.ts')
    slots_path = os.path.join(root_dir, 'scripts', 'verified_4_slots_pool.json')

    with open(data_path, 'r', encoding='utf-8') as f:
        units = json.load(f)

    with open(slots_path, 'r', encoding='utf-8') as f:
        slots = json.load(f)

    exterior_pool = slots['exterior']
    living_pool = slots['living']
    bedroom_pool = slots['bedroom']
    balcony_pool = slots['balcony']

    print(f"Loaded {len(units)} units.")
    print(f"Pool sizes: Exterior={len(exterior_pool)}, Living={len(living_pool)}, Bedroom={len(bedroom_pool)}, Balcony={len(balcony_pool)}")

    # Assign 4 slots with strict coherence
    all_assigned_urls = set()
    for idx, u in enumerate(units):
        u_name = u.get('name', '')
        # Deterministic style offset
        style_seed = sum(ord(c) for c in u_name) % 97

        ext_img = exterior_pool[(idx * 3 + style_seed) % len(exterior_pool)]
        liv_img = living_pool[(idx * 5 + style_seed + 13) % len(living_pool)]
        bed_img = bedroom_pool[(idx * 7 + style_seed + 29) % len(bedroom_pool)]
        bal_img = balcony_pool[(idx * 11 + style_seed + 43) % len(balcony_pool)]

        u['images'] = [ext_img, liv_img, bed_img, bal_img]
        for img in u['images']:
            all_assigned_urls.add(img)

    print(f"Assigned 4 slots across all units. Total unique URLs used: {len(all_assigned_urls)}")

    # 1. Save data/mock_units_1700.json
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(units, f, indent=2, ensure_ascii=False)
    print(f"Saved {data_path}")

    # 2. Update src/data/mockData.ts
    with open(mock_data_path, 'r', encoding='utf-8') as f:
        orig = f.read()

    m_tickets = re.search(r'export const MOCK_TICKETS: MaintenanceTicket\[\] = .*', orig, re.DOTALL)
    if not m_tickets:
        print("Error: Could not find MOCK_TICKETS in mockData.ts")
        sys.exit(1)

    tickets_and_rest = m_tickets.group(0)

    chunk_size = 250
    chunks = [units[i:i + chunk_size] for i in range(0, len(units), chunk_size)]
    chunk_declarations = []
    chunk_names = []
    for c_idx, chunk in enumerate(chunks):
        c_name = f"_UNITS_PART_{c_idx + 1}"
        chunk_names.append(c_name)
        c_json = json.dumps(chunk, indent=2, ensure_ascii=False)
        chunk_declarations.append(f"const {c_name}: ApartmentUnit[] = {c_json};")

    all_chunks_code = "\n\n".join(chunk_declarations)
    concat_expression = f"export const MOCK_UNITS: ApartmentUnit[] = {chunk_names[0]}.concat({', '.join(chunk_names[1:])});"

    new_mock_data_content = f"""import type {{ ApartmentUnit, MaintenanceTicket, Amenity }} from '../types/apartment';

{all_chunks_code}

{concat_expression}

{tickets_and_rest}"""

    with open(mock_data_path, 'w', encoding='utf-8') as f:
        f.write(new_mock_data_content)
    print(f"Updated {mock_data_path} successfully!")

    # 3. Create image manifest with slot metadata
    manifest = []
    img_to_units = defaultdict(list)
    img_to_styles = defaultdict(set)
    img_to_slot = {}

    # Map pool images to their designated slot
    for img in exterior_pool:
        img_to_slot[img] = 'exterior'
    for img in living_pool:
        img_to_slot[img] = 'living'
    for img in bedroom_pool:
        img_to_slot[img] = 'bedroom'
    for img in balcony_pool:
        img_to_slot[img] = 'balcony'

    for u in units:
        u_id = u.get('id', '')
        u_name = u.get('name', '')
        u_type = u.get('type', '')
        u_city = u.get('city', '')
        for img in u['images']:
            img_to_units[img].append({'id': u_id, 'name': u_name, 'type': u_type, 'city': u_city})
            # Vibe tag
            n_low = u_name.lower()
            if 'indochine' in n_low or 'đông dương' in n_low:
                img_to_styles[img].add('Indochine / Đông Dương')
            elif 'japandi' in n_low or 'tối giản' in n_low:
                img_to_styles[img].add('Japandi / Wabi-sabi')
            elif 'penthouse' in n_low or 'sky villa' in n_low:
                img_to_styles[img].add('Penthouse Luxury / Panorama')
            elif 'duplex' in n_low or 'thông tầng' in n_low:
                img_to_styles[img].add('Duplex Loft / High Ceiling')
            elif 'cổ điển' in n_low or 'tân cổ' in n_low:
                img_to_styles[img].add('Tân Cổ Điển Hoàng Gia')
            elif 'scandinavian' in n_low or 'bắc âu' in n_low:
                img_to_styles[img].add('Scandinavian Bắc Âu')
            else:
                img_to_styles[img].add('Modern Luxury Minimalist')

    sorted_imgs = sorted(list(all_assigned_urls))
    for idx, img_url in enumerate(sorted_imgs, 1):
        item = {
            'image_id': f"IMG-{idx:04d}",
            'url': img_url,
            'slot_type': img_to_slot.get(img_url, 'interior'),
            'primary_style': list(img_to_styles[img_url])[0] if img_to_styles[img_url] else 'Modern Luxury',
            'style_tags': sorted(list(img_to_styles[img_url])),
            'linked_units_count': len(img_to_units[img_url]),
            'linked_units': img_to_units[img_url][:5]
        }
        manifest.append(item)

    manifest_path = os.path.join(root_dir, 'data', '02_haven_image_manifest_818.json')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"Saved manifest to {manifest_path} ({len(manifest)} items)")

    # 4. Package zip for Colab
    zip_path = os.path.join(root_dir, 'data', '02_haven_visual_dataset_818.zip')
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.write(manifest_path, arcname='02_haven_image_manifest_818.json')
        readme = f"""# HAVEN Luxury PropTech — Visual Search Dataset
Total unique verified architectural photos: {len(manifest)}
HTTP Status: 100% Verified HTTP 200 OK (0 broken links)
Slot Architecture:
- Slot 1: Exterior / Facade / Building View
- Slot 2: Living Room / Primary Lounge
- Slot 3: Master Bedroom / Suite
- Slot 4: Balcony / Kitchen / Panoramic Cityscape
"""
        zf.writestr('README.md', readme)

    print(f"Created dataset zip: {zip_path} ({os.path.getsize(zip_path)} bytes)")

    # Copy to Google Drive COLAB directory
    drive_colab = r'G:\My Drive\COLAB'
    if os.path.exists(drive_colab):
        dest = os.path.join(drive_colab, '02_haven_visual_dataset_818.zip')
        shutil.copy2(zip_path, dest)
        print(f"Synced to Google Drive: {dest} ({os.path.getsize(dest)} bytes)")
    else:
        print(f"Notice: {drive_colab} not found or not mounted.")

if __name__ == '__main__':
    main()

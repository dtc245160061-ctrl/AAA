import json
import os
import shutil
import zipfile
from collections import defaultdict

def prepare_visual_dataset():
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'mock_units_1700.json')
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
        return

    with open(data_path, 'r', encoding='utf-8') as f:
        units = json.load(f)

    print(f"Loaded {len(units)} units.")

    # Group units by unique image URL
    image_to_units = defaultdict(list)
    image_to_styles = defaultdict(set)
    image_to_types = defaultdict(set)
    image_to_cities = defaultdict(set)

    for u in units:
        unit_id = u.get('id', '')
        unit_name = u.get('name', '')
        unit_type = u.get('type', '')
        city = u.get('city', '')
        images = u.get('images', [])

        # Deduce vibe / architectural style tags
        vibe_tags = []
        name_lower = unit_name.lower()
        if 'indochine' in name_lower or 'đông dương' in name_lower:
            vibe_tags.append('Indochine / Đông Dương')
        if 'japandi' in name_lower or 'tối giản' in name_lower or 'zen' in name_lower:
            vibe_tags.append('Japandi / Wabi-sabi')
        if 'penthouse' in name_lower or 'sky villa' in name_lower:
            vibe_tags.append('Penthouse Luxury / Panorama')
        if 'duplex' in name_lower or 'thông tầng' in name_lower or 'loft' in name_lower:
            vibe_tags.append('Duplex Loft / High Ceiling')
        if 'cổ điển' in name_lower or 'châu âu' in name_lower or 'tân cổ' in name_lower or 'quý tộc' in name_lower:
            vibe_tags.append('Cổ Điển Hoàng Gia / Tân Cổ Điển')
        if 'scandinavian' in name_lower or 'bắc âu' in name_lower:
            vibe_tags.append('Scandinavian / Bắc Âu')
        if 'eco' in name_lower or 'xanh' in name_lower or 'garden' in name_lower:
            vibe_tags.append('Eco Green / Tropical')
        if 'hiện đại' in name_lower or 'modern' in name_lower or not vibe_tags:
            vibe_tags.append('Modern Luxury Minimalist')

        for img in images:
            if not img or not img.startswith('http'):
                continue
            image_to_units[img].append({
                'id': unit_id,
                'name': unit_name,
                'type': unit_type,
                'city': city,
                'rentVND': u.get('monthlyRentVND', 0)
            })
            for v in vibe_tags:
                image_to_styles[img].add(v)
            if unit_type:
                image_to_types[img].add(unit_type)
            if city:
                image_to_cities[img].add(city)

    unique_images = list(image_to_units.keys())
    print(f"Total unique images: {len(unique_images)}")

    manifest = []
    for idx, img_url in enumerate(unique_images, 1):
        item = {
            'image_id': f"IMG-{idx:04d}",
            'url': img_url,
            'primary_style': list(image_to_styles[img_url])[0] if image_to_styles[img_url] else 'Modern Luxury',
            'style_tags': sorted(list(image_to_styles[img_url])),
            'property_types': sorted(list(image_to_types[img_url])),
            'cities': sorted(list(image_to_cities[img_url])),
            'linked_units_count': len(image_to_units[img_url]),
            'linked_units': image_to_units[img_url]
        }
        manifest.append(item)

    # Save manifest
    manifest_path = os.path.join(os.path.dirname(__file__), '..', 'data', '02_haven_image_manifest_818.json')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"Saved manifest to {manifest_path} ({len(manifest)} items)")

    # Create zip file for Colab training
    zip_filename = '02_haven_visual_dataset_818.zip'
    local_zip_path = os.path.join(os.path.dirname(__file__), '..', 'data', zip_filename)
    
    with zipfile.ZipFile(local_zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.write(manifest_path, arcname='02_haven_image_manifest_818.json')
        # Also include sample instruction README inside zip
        readme_content = f"""# HAVEN Luxury PropTech - Visual Search Dataset
Total unique architectural photos: {len(manifest)}
Source: HAVEN Luxury Residential Database (1,700 listings)

Usage in Colab:
- Load 02_haven_image_manifest_818.json
- Download or stream image URLs using PIL / requests / urllib
- Extract visual features with CLIP (openai/clip-vit-base-patch32) or SigLIP
- Export embeddings to haven_visual_embeddings_clip.json
"""
        zf.writestr('README.md', readme_content)

    print(f"Created local zip: {local_zip_path} ({os.path.getsize(local_zip_path)} bytes)")

    # Copy to Google Drive if available
    drive_colab_dir = r'G:\My Drive\COLAB'
    if os.path.exists(drive_colab_dir):
        dest_zip = os.path.join(drive_colab_dir, zip_filename)
        shutil.copy2(local_zip_path, dest_zip)
        print(f"Successfully copied to Google Drive: {dest_zip} ({os.path.getsize(dest_zip)} bytes)")
    else:
        print(f"Warning: {drive_colab_dir} not mounted.")

if __name__ == '__main__':
    prepare_visual_dataset()

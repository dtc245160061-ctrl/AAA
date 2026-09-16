import json

with open('scripts/working_matterport.json', encoding='utf-8') as f:
    data = json.load(f)

# Deduplicate by id
unique_models = {}
for m in data:
    mid = m['id']
    if mid not in unique_models:
        unique_models[mid] = m

models = list(unique_models.values())
print(f"Unique verified models: {len(models)}")

ts_content = """// Curated Library of 50+ Verified Real-World 3D Matterport Digital Twins
// Photogrammetry 3D scans of real apartments, studios, condos, suites, and penthouses.

export interface MatterportTourItem {
  id: string;
  name: string;
  category: 'studio' | '1bed' | '2bed' | '3bed' | '4bed' | 'penthouse' | 'villa' | 'condo' | 'suite' | 'apartment';
  categoryLabel: string;
  bedroomCount: number;
  description: string;
  embedUrl: string;
}

export const VERIFIED_MATTERPORT_TOURS: MatterportTourItem[] = [
"""

for m in models:
    cat = m['category']
    raw_name = m['name']
    safe_name = raw_name.replace("'", "\\'").replace('"', '\\"')
    
    cat_label = 'Căn hộ'
    beds = 2
    if cat == 'studio':
        cat_label = 'Studio'
        beds = 1
    elif cat == '1bed':
        cat_label = '1 Phòng ngủ'
        beds = 1
    elif cat == '2bed':
        cat_label = '2 Phòng ngủ'
        beds = 2
    elif cat == '3bed':
        cat_label = '3 Phòng ngủ'
        beds = 3
    elif cat == '4bed':
        cat_label = '4 Phòng ngủ'
        beds = 4
    elif cat == 'penthouse':
        cat_label = 'Penthouse Cao Cấp'
        beds = 4
    elif cat == 'villa':
        cat_label = 'Biệt Thự / Villa'
        beds = 4
    elif cat == 'condo':
        cat_label = 'Căn hộ Chung cư'
        beds = 2
    elif cat == 'suite':
        cat_label = 'Suite Hạng Sang'
        beds = 2

    desc = f'Không gian thực tế {cat_label} với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.'
    embed_url = f'https://my.matterport.com/show/?m={m["id"]}&play=1&qs=1&brand=0&title=0'

    ts_content += f"""  {{
    id: '{m["id"]}',
    name: '{safe_name}',
    category: '{cat}',
    categoryLabel: '{cat_label}',
    bedroomCount: {beds},
    description: '{desc}',
    embedUrl: '{embed_url}'
  }},
"""

ts_content += """];

// Smart deterministic mapping from unit to a matching 3D tour
export function getMatterportTourForUnit(unit: { id: string; bedrooms?: number; sqm?: number; priceVND?: number; type?: string }): MatterportTourItem {
  if (!unit) return VERIFIED_MATTERPORT_TOURS[0];

  const beds = unit.bedrooms || 1;
  const sqm = unit.sqm || 50;
  const typeStr = (unit.type || '').toLowerCase();

  let pool: MatterportTourItem[] = [];

  if (typeStr.includes('penthouse') || typeStr.includes('sky villa') || sqm > 140) {
    pool = VERIFIED_MATTERPORT_TOURS.filter(t => t.category === 'penthouse' || t.category === 'villa');
  } else if (beds <= 1 || typeStr.includes('studio') || sqm <= 42) {
    pool = VERIFIED_MATTERPORT_TOURS.filter(t => t.category === 'studio' || t.category === '1bed');
  } else if (beds === 2) {
    pool = VERIFIED_MATTERPORT_TOURS.filter(t => t.category === '2bed' || t.category === 'condo' || t.category === 'apartment');
  } else if (beds >= 3) {
    pool = VERIFIED_MATTERPORT_TOURS.filter(t => t.category === '3bed' || t.category === '4bed' || t.category === 'penthouse');
  }

  if (pool.length === 0) {
    pool = VERIFIED_MATTERPORT_TOURS;
  }

  // Hash unit.id for consistent assignment
  let hash = 0;
  const str = unit.id || 'unit-default';
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }

  return pool[hash % pool.length];
}
"""

with open('src/data/matterportTours.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Generated src/data/matterportTours.ts successfully!")

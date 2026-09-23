import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Read mockData.ts
with open('src/data/mockData.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

units_start_line = None
units_end_line = None
for i, l in enumerate(lines):
    if l.startswith('export const MOCK_UNITS: ApartmentUnit[] = '):
        units_start_line = i
    elif l.startswith('export const MOCK_TICKETS: MaintenanceTicket[] = '):
        units_end_line = i
        break

if units_start_line is None or units_end_line is None:
    print('Failed to locate MOCK_UNITS bounds in mockData.ts')
    sys.exit(1)

units_json_str = ''.join(lines[units_start_line:units_end_line]).strip()
if units_json_str.startswith('export const MOCK_UNITS: ApartmentUnit[] = '):
    units_json_str = units_json_str[len('export const MOCK_UNITS: ApartmentUnit[] = '):]
if units_json_str.endswith(';'):
    units_json_str = units_json_str[:-1]

units = json.loads(units_json_str)
print(f'Loaded {len(units)} units from mockData.ts')

# 2. Load verified photo pool
with open('scripts/all_verified_unique_pool.json', 'r', encoding='utf-8') as f:
    photo_pool = json.load(f)
pool_size = len(photo_pool)

# 3. Ensure every unit has 4 unique photos
for idx, u in enumerate(units):
    imgs = list(u.get('images', []))
    offset = 211
    while len(imgs) < 4:
        cand = photo_pool[(idx * 7 + offset) % pool_size]
        if cand not in imgs:
            imgs.append(cand)
        offset += 43
    u['images'] = imgs[:4]

# Verification of 4 unique images
assert all(len(u['images']) == 4 for u in units), "Not all units have 4 photos!"
assert all(len(set(u['images'])) == 4 for u in units), "Some units have duplicate photos!"
print("Checked: 100% of units have 4 strictly unique photos.")

# 4. Partition units by city
city_buckets = {}
for u in units:
    city = u['city']
    if city not in city_buckets:
        city_buckets[city] = []
    city_buckets[city].append(u)

# City priority tiers
# Priority 1: Hà Nội, TP. Hồ Chí Minh
# Priority 2: Đà Nẵng, Hải Phòng, Cần Thơ
# Priority 3: Thái Nguyên, Bình Dương, Bắc Ninh, Quảng Ninh, Khánh Hòa, Lâm Đồng
priority_cities = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Thái Nguyên',
    'Bình Dương',
    'Bắc Ninh',
    'Quảng Ninh',
    'Khánh Hòa',
    'Lâm Đồng'
]

# Interleave units with major cities leading
interleaved_units = []
city_indices = {c: 0 for c in city_buckets}

# Ratio pattern per cycle:
# 2 HN, 2 SG, 1 DN, 1 HP, 1 TN, 1 other
cycle_pattern = [
    'Hà Nội', 'TP. Hồ Chí Minh', 
    'Hà Nội', 'TP. Hồ Chí Minh', 
    'Đà Nẵng', 
    'Hải Phòng', 
    'Thái Nguyên',
    'Bình Dương',
    'Bắc Ninh',
    'Cần Thơ',
    'Quảng Ninh',
    'Khánh Hòa',
    'Lâm Đồng'
]

while len(interleaved_units) < len(units):
    added_in_cycle = 0
    for target_city in cycle_pattern:
        if target_city in city_buckets and city_indices[target_city] < len(city_buckets[target_city]):
            interleaved_units.append(city_buckets[target_city][city_indices[target_city]])
            city_indices[target_city] += 1
            added_in_cycle += 1
    
    if added_in_cycle == 0:
        # Append any remaining units from any bucket
        for c, bucket in city_buckets.items():
            while city_indices[c] < len(bucket):
                interleaved_units.append(bucket[city_indices[c]])
                city_indices[c] += 1
        break

assert len(interleaved_units) == len(units), f"Count mismatch: {len(interleaved_units)} vs {len(units)}"
print(f"Interleaved {len(interleaved_units)} units.")
print("Top 10 units after interleaving:")
for i in range(10):
    u = interleaved_units[i]
    print(f"  {i+1}. [{u['city']} - {u['district']}] {u['name']}")

# 5. Format new MOCK_UNITS JSON
new_units_json = json.dumps(interleaved_units, ensure_ascii=False, indent=2)

# 6. Reassemble mockData.ts
prefix_content = ''.join(lines[:units_start_line])
suffix_content = ''.join(lines[units_end_line:])

new_file_content = f"{prefix_content}export const MOCK_UNITS: ApartmentUnit[] = {new_units_json};\n\n{suffix_content}"

with open('src/data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(new_file_content)

print("Successfully written enriched and interleaved dataset to src/data/mockData.ts!")

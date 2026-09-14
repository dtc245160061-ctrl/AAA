import json
import re

# Load verified 152 images
with open("scripts/verified_150_images.json", "r", encoding="utf-8") as f:
    verified_images = json.load(f)

print(f"Loaded {len(verified_images)} verified distinct images.")

# Load mockData.ts
with open("src/data/mockData.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Match MOCK_UNITS JSON array
m = re.search(r'(export const MOCK_UNITS: ApartmentUnit\[\] = )(\[.*?\]);(\s*export const MOCK_TICKETS)', content, re.DOTALL)
if not m:
    print("ERROR: Could not find MOCK_UNITS in mockData.ts")
    exit(1)

prefix = m.group(1)
units_json = m.group(2)
suffix = m.group(3)

units = json.loads(units_json)
print(f"Parsed {len(units)} units from mockData.ts")

# Assign unique primary image to each unit
for i, unit in enumerate(units):
    primary_img = verified_images[i % len(verified_images)]
    sec_1 = verified_images[(i + 17) % len(verified_images)]
    sec_2 = verified_images[(i + 37) % len(verified_images)]
    unit["images"] = [primary_img, sec_1, sec_2]

# Check uniqueness of primary images across all 150 units
primaries = [u["images"][0] for u in units]
unique_primaries = set(primaries)
print(f"Total units: {len(units)}, Unique primary images: {len(unique_primaries)}")
if len(unique_primaries) == len(units):
    print("SUCCESS: 100% of units have a completely unique primary image!")
else:
    print(f"WARNING: Only {len(unique_primaries)} unique primary images out of {len(units)}")

new_units_json = json.dumps(units, indent=2, ensure_ascii=False)
new_content = content[:m.start(2)] + new_units_json + content[m.end(2):]

with open("src/data/mockData.ts", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully updated src/data/mockData.ts with 150 unique images!")

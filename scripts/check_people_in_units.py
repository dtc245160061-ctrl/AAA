import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Known portrait IDs and face IDs flagged in earlier inspection
flagged_faces_file = os.path.join(os.path.dirname(__file__), 'flagged_faces.json')
face_ids = set()
if os.path.exists(flagged_faces_file):
    with open(flagged_faces_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for item in data:
            if isinstance(item, list) and len(item) > 1:
                face_ids.add(str(item[1]))

print(f"Loaded {len(face_ids)} known face image IDs from flagged_faces.json")

# Also known avatar photo IDs
known_avatar_ids = [
    "1534528741775-53994a69daeb",
    "1517841905240-472988babdf9",
    "1507003211169-0a1dd7228f2d",
    "1494790108377-be9c29b29330",
    "1500648767791-00dcc994a43e",
    "1472099645785-5658abf4ff4e",
    "1544005313-94ddf0286df2",
    "1519085360753-af0119f7cbe7",
    "1506794778202-cad84cf45f1d",
    "1501196354995-cbb51c65aaea",
    "1535713875002-d1d0cf377fde",
    "1570295999919-56ceb5ecca61",
    "1580489944761-15a19d654956",
    "1438761681033-6461ffad8d80",
    "1522075469751-3a6694fb2f61",
    "1548142813-c348350df52b",
    "1531746020798-e6953c6e8e04",
    "1508214751196-bcfd4ca60f91"
]
for a in known_avatar_ids:
    face_ids.add(a)

# Inspect mock_units_1700.json
mock_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'mock_units_1700.json')
with open(mock_path, 'r', encoding='utf-8') as f:
    units = json.load(f)

flagged_units = []
for idx, u in enumerate(units):
    for s_idx, img in enumerate(u.get('images', [])):
        for fid in face_ids:
            if fid in img:
                flagged_units.append((idx, u['id'], u['name'], s_idx, img, fid))

print(f"Total units checked: {len(units)}")
print(f"Total images with face/people flagged: {len(flagged_units)}")
for fu in flagged_units[:25]:
    print(f"Unit [{fu[0]}] {fu[1]} - Slot {fu[3]}: PID {fu[5]}")


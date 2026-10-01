import json
import os
import sys

# Load all known face and avatar IDs
known_face_ids = set([
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
    "1508214751196-bcfd4ca60f91",
    "1653854758754-4bda12e382e6",
    "1760478869977-a1b4cf15e929",
    "1608494604059-7971195e13e1",
    "1538688525198-9b88f6f53126",
    "1628745423051-2cf1d836ccfb",
    "1760263137646-eadb18d93d23",
    "1613850011958-cfb3e7364058",
    "1664813953310-ea2953c0ec99",
    "1696986324679-dad26261d579",
    "1782392454932-35a85377d02c",
    "1608034802731-97a868788e11",
    "1671869239603-8d73133e0e5e",
    "1778731525489-020d49e8e1a1",
    "1628371840155-97a135860616",
    "1595061108865-47e6c662f4c6",
    "1638840992956-142399e7e2df",
    "1608034809014-73e7d72f25b4",
    "1613545564259-ede280773613",
    "1699800900071-ae073285ca02",
    "1760072513376-67a46aab0fd1",
    "1714860534425-7ce04e013dec"
])

# Load flagged faces if exists
flagged_file = os.path.join(os.path.dirname(__file__), 'flagged_faces.json')
if os.path.exists(flagged_file):
    with open(flagged_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for item in data:
            if isinstance(item, list) and len(item) > 1:
                known_face_ids.add(str(item[1]))

print(f"Total known face/avatar IDs to eliminate: {len(known_face_ids)}")

# Load candidate pool
pool_file = os.path.join(os.path.dirname(__file__), '100_percent_verified_alive_pool.json')
with open(pool_file, 'r', encoding='utf-8') as f:
    pool = json.load(f)

clean_pool = []
for url in pool:
    has_face = False
    for fid in known_face_ids:
        if fid in url:
            has_face = True
            break
    if not has_face:
        clean_pool.append(url)

print(f"Original pool: {len(pool)} | Clean (100% PURE REAL ESTATE, 0 PEOPLE/PORTRAITS): {len(clean_pool)}")

clean_pool_file = os.path.join(os.path.dirname(__file__), 'zero_face_master_pool.json')
with open(clean_pool_file, 'w', encoding='utf-8') as f:
    json.dump(clean_pool, f, indent=2)

print(f"Saved to {clean_pool_file}")

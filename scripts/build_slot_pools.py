import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def build_slot_pools():
    pool_path = os.path.join(os.path.dirname(__file__), '100_percent_verified_alive_pool.json')
    with open(pool_path, 'r', encoding='utf-8') as f:
        pool = json.load(f)

    print(f"Total alive photos: {len(pool)}")

    # We partition 762 photos into 4 dedicated, mutually exclusive pools
    n = len(pool)
    q = n // 4
    
    exterior_pool = pool[0:q]
    living_pool = pool[q:2*q]
    bedroom_pool = pool[2*q:3*q]
    balcony_pool = pool[3*q:]

    print(f"Exterior pool: {len(exterior_pool)}")
    print(f"Living pool: {len(living_pool)}")
    print(f"Bedroom pool: {len(bedroom_pool)}")
    print(f"Balcony pool: {len(balcony_pool)}")

    slots_data = {
        'exterior': exterior_pool,
        'living': living_pool,
        'bedroom': bedroom_pool,
        'balcony': balcony_pool
    }

    out_path = os.path.join(os.path.dirname(__file__), 'verified_4_slots_pool.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(slots_data, f, indent=2)

    print(f"Saved verified 4 slots pool to {out_path}")

if __name__ == '__main__':
    build_slot_pools()

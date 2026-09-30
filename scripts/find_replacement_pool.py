import json
import os
import sys
import urllib.request
import concurrent.futures

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def find_replacement_pool():
    # 1. Load the 65 failed URLs
    # We know the failed list from the previous run
    mock_1700_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'mock_units_1700.json')
    with open(mock_1700_path, 'r', encoding='utf-8') as f:
        units = json.load(f)

    # Load verified_working_master_pool
    pool_path = os.path.join(os.path.dirname(__file__), 'verified_working_master_pool.json')
    with open(pool_path, 'r', encoding='utf-8') as f:
        pool = json.load(f)

    print(f"Total candidates in pool: {len(pool)}")

    def check_url(url):
        try:
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'},
                method='HEAD'
            )
            with urllib.request.urlopen(req, timeout=6) as resp:
                if resp.status == 200:
                    return url
        except Exception:
            return None
        return None

    # Test all pool URLs
    unique_candidates = list(dict.fromkeys(pool))
    print(f"Testing {len(unique_candidates)} candidate URLs...")

    with concurrent.futures.ThreadPoolExecutor(max_workers=30) as executor:
        results = list(executor.map(check_url, unique_candidates))

    valid_urls = [r for r in results if r is not None]
    print(f"Found {len(valid_urls)} 100% verified working URLs in pool!")

    out_path = os.path.join(os.path.dirname(__file__), '100_percent_verified_alive_pool.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(valid_urls, f, indent=2)
    print(f"Saved to {out_path}")

if __name__ == '__main__':
    find_replacement_pool()

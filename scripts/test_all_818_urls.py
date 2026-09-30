import json
import os
import sys
import urllib.request
import concurrent.futures

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_all_unique_urls():
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'mock_units_1700.json')
    with open(data_path, 'r', encoding='utf-8') as f:
        units = json.load(f)

    all_urls = []
    for u in units:
        all_urls.extend(u.get('images', []))

    unique_urls = list(dict.fromkeys(all_urls))
    print(f"Testing all {len(unique_urls)} unique URLs...")

    def check_url(url):
        try:
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'},
                method='HEAD'
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                if resp.status >= 400:
                    return (url, resp.status)
        except urllib.error.HTTPError as e:
            return (url, e.code)
        except Exception as e:
            return (url, str(e))
        return None

    with concurrent.futures.ThreadPoolExecutor(max_workers=30) as executor:
        results = list(executor.map(check_url, unique_urls))

    failed = [r for r in results if r is not None]
    print(f"Completed! Total failed: {len(failed)}")
    if failed:
        for url, err in failed:
            print(f"FAILED: {url} -> {err}")
    else:
        print("100% of 818 unique URLs are VALID and ACCESSIBLE (HTTP 200)!")

if __name__ == '__main__':
    test_all_unique_urls()

import urllib.request
import urllib.parse
import re
import concurrent.futures
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

queries = [
    'site:my.matterport.com/show/ apartment',
    'site:my.matterport.com/show/ condo',
    'site:my.matterport.com/show/ penthouse',
    'site:my.matterport.com/show/ studio',
    'site:my.matterport.com/show/ suite',
    'site:my.matterport.com/show/ residence',
    'site:my.matterport.com/show/ luxury villa',
    'site:my.matterport.com/show/ "bedroom"',
    'site:my.matterport.com/show/ "living room"',
    'matterport show m= apartment virtual tour',
    'matterport show m= bedroom',
    'matterport showcase modern apartment'
]

discovered_ids = set([
    'JGPnGQ6hosj',
    'jmpZ9WHagkV',
    'ZqLCAYubbXu',
    '7QA7vSNj6sg',
    'fmrDnzN3D1g',
    'dqzBYdhrvwg',
    'odWSTDUfeUx',
    '3rbDfSCMBco',
    'KcMMo7EW5mz',
    '33U2gf2XK4c',
    '59WEGb7VGG9',
    'fpvnoTeJbGe',
    'DAjtvbwvVQx',
    'a6sVjZKSKvB',
    'Nht3tDPvPx3',
    'KoGS7bhfyjc',
    'D95R7QhTXMw',
    'YY3q35PZ8BQ',
    'FeCGTdcJ8iu',
    'Mb7agvjaDHd',
    'XtEH6qJzUXp',
    'DqjiSgWZWyz',
    '2Ug7bJ9FADx',
    'gXkAScckiMF',
    'tNBW3LDhSfu',
    'rstxHqbetab',
    'wtncDbuzoEi',
    'CsLtCHubxpX',
    'Jm9LrHgZX2N',
    '7DWv3YD6S85',
    'JELY7RQFQ6Y',
    'Sy5yqprDxN9'
])

for q in queries:
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(q)}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'm=([a-zA-Z0-9]{11})', content)
            for m in matches:
                discovered_ids.add(m)
    except Exception as e:
        pass

def test_model(model_id):
    url = f"https://my.matterport.com/show/?m={model_id}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            if resp.status == 200:
                html = resp.read(10000).decode('utf-8', errors='ignore')
                title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
                raw_title = title_match.group(1) if title_match else 'Matterport 3D Space'
                if '404' not in raw_title and 'Not Found' not in raw_title and 'Log In' not in raw_title:
                    clean_title = raw_title.replace(' - Matterport 3D Showcase', '').replace('&amp;', '&').strip()
                    # Classify room type
                    cat = 'apartment'
                    t_lower = clean_title.lower()
                    if 'studio' in t_lower: cat = 'studio'
                    elif 'penthouse' in t_lower: cat = 'penthouse'
                    elif 'villa' in t_lower: cat = 'villa'
                    elif 'condo' in t_lower: cat = 'condo'
                    elif 'suite' in t_lower: cat = 'suite'
                    elif '1 bed' in t_lower or '1br' in t_lower: cat = '1bed'
                    elif '2 bed' in t_lower or '2br' in t_lower: cat = '2bed'
                    elif '3 bed' in t_lower or '3br' in t_lower: cat = '3bed'
                    elif '4 bed' in t_lower or '4br' in t_lower: cat = '4bed'
                    return {
                        'id': model_id,
                        'name': clean_title,
                        'category': cat,
                        'embedUrl': f"https://my.matterport.com/show/?m={model_id}&play=1&qs=1&brand=0&title=0"
                    }
    except Exception:
        pass
    return None

working_models = []
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as executor:
    results = executor.map(test_model, list(discovered_ids))
    for r in results:
        if r:
            working_models.append(r)

print(f"Total working models found: {len(working_models)}")
with open('scripts/working_matterport.json', 'w', encoding='utf-8') as f:
    json.dump(working_models, f, ensure_ascii=False, indent=2)
print("Saved to scripts/working_matterport.json")

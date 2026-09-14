import re

with open('src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

urls = re.findall(r'(https://images\.unsplash\.com/[^\s"\'<>]+)', content)
clean_urls = set()
for u in urls:
    clean_urls.add(u.split('?')[0])

print(f"Total URL occurrences: {len(urls)}")
print(f"Unique base URLs: {len(clean_urls)}")


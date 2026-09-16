import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/mockData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

city_matches = re.findall(r'"city":\s*"([^"]+)"', text)
cities = sorted(list(set(city_matches)))
print(f"Total units: {len(city_matches)}")
print(f"Cities count: {len(cities)}")
for c in cities:
    cnt = city_matches.count(c)
    print(f"  {c}: {cnt} units")


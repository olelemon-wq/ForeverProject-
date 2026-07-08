import json

log_path = "/Users/ole/ForeverProject/scratch/projects.json"

with open(log_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

projects = data.get("projects", [])
proj = next(p for p in projects if p.get("name") == "projects/905156898704603918")

print(f"Project name: {proj.get('name')}")
print(f"Project title: {proj.get('title')}")
screens = proj.get("screenInstances", [])
print(f"Total screens: {len(screens)}")

for idx, s in enumerate(screens):
    # Print all key-value pairs except very large nested structures
    print(f"\nScreen {idx+1}:")
    for k, v in s.items():
        if k not in ['components', 'designMd', 'namedColors']:
            print(f"  {k}: {v}")
    if idx >= 15:
        print("\n... and more")
        break

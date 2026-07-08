import json

log_path = "/Users/ole/ForeverProject/scratch/projects.json"

with open(log_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

projects = data.get("projects", [])
proj = next(p for p in projects if p.get("name") == "projects/905156898704603918")

screens = proj.get("screenInstances", [])
for idx, s in enumerate(screens):
    # Search keys
    matches = {k: v for k, v in s.items() if any(term in k.lower() for term in ['title', 'name', 'label', 'type', 'slug'])}
    if matches:
        print(f"Screen {idx+1} ({s.get('id')}): {matches}")

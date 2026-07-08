import json

log_path = "/Users/ole/ForeverProject/scratch/projects.json"

with open(log_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

projects = data.get("projects", [])
proj = next(p for p in projects if p.get("name") == "projects/905156898704603918")

screens = proj.get("screenInstances", [])
print(f"Total screens: {len(screens)}")

print("\n--- Non-hidden / Favorite screens ---")
for idx, s in enumerate(screens):
    hidden = s.get("hidden", False)
    fav = s.get("isFavourite", False)
    screen_type = s.get("type", "SCREEN_INSTANCE")
    if not hidden or fav:
        print(f"Index {idx+1} | ID: {s.get('id')} | Hidden: {hidden} | Fav: {fav} | Size: {s.get('width')}x{s.get('height')} | Type: {screen_type}")

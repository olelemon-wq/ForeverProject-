import json

log_path = "/Users/ole/ForeverProject/scratch/projects.json"

try:
    with open(log_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    projects = data.get("projects", [])
    print(f"Total projects found: {len(projects)}")
    for idx, p in enumerate(projects):
        title = p.get("title", "No Title")
        name = p.get("name")
        screens = p.get("screenInstances", [])
        print(f"\nProject {idx+1}:")
        print(f"  Name: {name}")
        print(f"  Title: {title}")
        print(f"  Screen count: {len(screens)}")
        
        # Let's list some screen IDs
        for s in screens[:5]:
            print(f"    - Screen: {s.get('id')} ({s.get('width')}x{s.get('height')})")
        if len(screens) > 5:
            print("    ...")
except Exception as e:
    print(f"Error parsing log file: {e}")

import json
import os

curr_log = "/Users/ole/.gemini/antigravity/brain/934f6d46-8147-4127-927b-b37a8cadd184/.system_generated/logs/transcript_full.jsonl"
target_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

# Restore clean version from git first to make sure we start fresh
os.system(f"git restore {target_file}")

with open(target_file, 'r', encoding='utf-8') as f:
    current_content = f.read()

print(f"Loaded initial clean file size: {len(current_content)} chars")

def apply_log(log_path):
    global current_content
    print(f"Processing log: {log_path}")
    if not os.path.exists(log_path):
        print(f"Log path does not exist: {log_path}")
        return

    with open(log_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    for i, line_str in enumerate(lines):
        try:
            step = json.loads(line_str)
        except Exception as e:
            continue
        
        source = step.get("source")
        # Only apply steps before the current model turn (step index < 4900)
        step_idx = step.get("step_index", 0)
        if step_idx >= 4900:
            continue
            
        if source == "MODEL" and "tool_calls" in step:
            for tool in step["tool_calls"]:
                name = tool.get("name")
                args = tool.get("args", {})
                
                if isinstance(args, str):
                    try:
                        args = json.loads(args)
                    except:
                        pass
                
                target = args.get("TargetFile") or args.get("Target") or ""
                target = target.strip('"').strip("'")
                
                if "app/manage/page.tsx" in target:
                    if name == "write_to_file":
                        code = args.get("CodeContent", "")
                        if code:
                            current_content = code
                            print(f"  -> write_to_file (step {step_idx}): set content size to {len(current_content)} chars")
                    
                    elif name == "replace_file_content":
                        target_content = args.get("TargetContent", "")
                        replacement = args.get("ReplacementContent", "")
                        if target_content in current_content:
                            current_content = current_content.replace(target_content, replacement, 1)
                            print(f"  -> replace_file_content (step {step_idx}): replaced content")
                        else:
                            print(f"  -> WARNING: target not found (step {step_idx})!")
                    
                    elif name == "multi_replace_file_content":
                        chunks = args.get("ReplacementChunks", [])
                        for chunk in chunks:
                            tc = chunk.get("TargetContent", "")
                            rc = chunk.get("ReplacementContent", "")
                            if tc in current_content:
                                current_content = current_content.replace(tc, rc, 1)
                                print(f"  -> multi_replace_file_content chunk (step {step_idx}): replaced")
                            else:
                                print(f"    -> WARNING: chunk target not found (step {step_idx})!")

# Apply current session logs chronologically
apply_log(curr_log)

# Write the final reconstructed content
if current_content:
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(current_content)
    print(f"Successfully restored page.tsx to {target_file} ({len(current_content)} chars)")
else:
    print("No content reconstructed!")

import json
import os

log_path = "/Users/ole/.gemini/antigravity/brain/934f6d46-8147-4127-927b-b37a8cadd184/.system_generated/logs/transcript_full.jsonl"
with open(log_path, 'r', encoding='utf-8') as f:
    for line_num, line_str in enumerate(f, 1):
        if "activeSubTab" in line_str:
            try:
                step = json.loads(line_str)
                print(f"Line {line_num} | Step {step.get('step_index')} | Type: {step.get('type')} | Status: {step.get('status')}")
            except Exception as e:
                print(f"Line {line_num} | Match found but JSON parse failed: {e}")

import json
import os

transcript_path = '/Users/ole/.gemini/antigravity/brain/934f6d46-8147-4127-927b-b37a8cadd184/.system_generated/logs/transcript.jsonl'
output_path = '/Users/ole/ForeverProject/scratch/chat_history.md'

os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

dialogue = []
for line in lines:
    try:
        obj = json.loads(line)
        t = obj.get('type')
        if t in ['USER_INPUT', 'PLANNER_RESPONSE']:
            content = obj.get('content', '')
            if isinstance(content, dict):
                content = content.get('text', '')
            content = content.strip()
            # Ignore purely technical English messages from assistant
            if t == 'PLANNER_RESPONSE' and not any(ch in content for ch in 'กขคงจชซทนบปผฝพฟมยรลวศษสหฬอฮ'):
                continue
            dialogue.append((t, content))
    except:
        pass

with open(output_path, 'w', encoding='utf-8') as f:
    f.write("# ประวัติการพูดคุยทั้งหมด (Chat History Log)\n\n")
    for idx, (role_type, text) in enumerate(dialogue):
        role = 'คุณ (User)' if role_type == 'USER_INPUT' else 'ผู้ช่วย (AI)'
        f.write(f"### {idx+1}. {role}\n")
        f.write(f"{text}\n\n")
        f.write("---\n\n")

print("Chat history written to scratch/chat_history.md")

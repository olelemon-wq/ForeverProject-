import json
import os

def main():
    log_path = '/Users/ole/.gemini/antigravity/brain/cc7b7d11-73fb-4963-90b7-d1c1640eff7e/.system_generated/logs/transcript_full.jsonl'
    if not os.path.exists(log_path):
        print("Log not found")
        return

    edits = []
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                if 'tool_calls' in data:
                    for tc in data['tool_calls']:
                        args = tc.get('args', {})
                        target = args.get('TargetFile', '') or args.get('Target', '')
                        if 'app/manage/page.tsx' in target:
                            edits.append({
                                'step': data.get('step_index'),
                                'tool': tc.get('name'),
                                'args': args
                            })
            except Exception as e:
                pass

    print(f"Found {len(edits)} edits to app/manage/page.tsx")
    # Print the last few edit details to verify
    for e in edits[-5:]:
        print(f"\nStep {e['step']} ({e['tool']}):")
        if 'ReplacementChunks' in e['args']:
            print(f"  Chunks: {len(e['args']['ReplacementChunks'])}")
            for idx, c in enumerate(e['args']['ReplacementChunks']):
                print(f"    Chunk {idx+1}: Target length={len(c['TargetContent'])}, Replacement length={len(c['ReplacementContent'])}")
        else:
            print(f"  Single target length={len(e['args'].get('TargetContent', ''))}, Replacement length={len(e['args'].get('ReplacementContent', ''))}")

if __name__ == '__main__':
    main()

with open("/Users/ole/ForeverProject/app/manage/page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Line numbers are 1-indexed, so index 3027 is line 3028
family_lines = lines[3027:3167]

brace_stack = []
for idx, line in enumerate(family_lines, 3028):
    for char_idx, char in enumerate(line, 1):
        if char in "({[":
            brace_stack.append((char, idx, char_idx))
        elif char in ")}]":
            if not brace_stack:
                print(f"Unexpected closing char '{char}' at line {idx}:{char_idx}")
                continue
            last_open, o_line, o_char = brace_stack.pop()
            # Check matching pairs
            if (char == ")" and last_open != "(") or \
               (char == "}" and last_open != "{") or \
               (char == "]" and last_open != "["):
                print(f"Mismatch: '{char}' at line {idx}:{char_idx} does not match '{last_open}' from line {o_line}:{o_char}")

print("Braces remaining in stack:")
for b, l, c in brace_stack:
    print(f"  Unclosed '{b}' from line {l}:{c}")

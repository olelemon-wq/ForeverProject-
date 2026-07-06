import os

def main():
    filepath = 'app/manage/page.tsx'
    if not os.path.exists(filepath):
        print('page.tsx not found!')
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define unique anchors for the family listing
    start_anchor = "{familyMembers.length === 0 ? ("
    start_idx = content.find(start_anchor)
    if start_idx == -1:
        print('Family list start anchor not found!')
        return

    # Find the next map call
    map_call = "familyMembers.map(m => {"
    map_idx = content.find(map_call, start_idx)
    if map_idx == -1:
        print('Map call not found!')
        return

    # Replace the map call
    sorted_map_call = """(() => {
                const relOrder: Record<string, number> = {
                  'PARENT_1': 1,
                  'PARENT_2': 2,
                  'SPOUSE': 3,
                  'SIBLING': 4,
                  'CHILD': 5,
                  'SON_IN_LAW': 6,
                  'DAUGHTER_IN_LAW': 7,
                  'GRANDCHILD': 8
                };
                const sorted = [...familyMembers].sort((a, b) => {
                  const valA = relOrder[a.relationship] || 99;
                  const valB = relOrder[b.relationship] || 99;
                  if (valA !== valB) return valA - valB;
                  const birthA = a.birthYear ? int(a.birthYear) : 9999;
                  const birthB = b.birthYear ? int(b.birthYear) : 9999;
                  if (birthA !== birthB) return birthA - birthB;
                  return a.name.localeCompare(b.name, 'th');
                });
                return sorted.map(m => {"""

    # Note: wait, in TypeScript we should use parseInt(a.birthYear) instead of int(a.birthYear)!
    sorted_map_call = sorted_map_call.replace('int(a.birthYear)', 'parseInt(a.birthYear)').replace('int(b.birthYear)', 'parseInt(b.birthYear)')

    # Find the closing tag: we want to find the closing '})' or '})}' corresponding to the map call.
    # To find the exact closing tag, we can search for the next edit/trash button container, then the next closing tag.
    trash_btn = "Trash2 className=\"w-3.5 h-3.5\""
    trash_idx = content.find(trash_btn, map_idx)
    if trash_idx == -1:
        print('Trash button icon reference not found!')
        return

    # Find the next '})' after trash_idx
    close_idx = content.find('})', trash_idx)
    if close_idx == -1:
        print('Closing map braces not found!')
        return

    # Let's perform replacement
    new_content = content[:map_idx] + sorted_map_call + content[map_idx + len(map_call):close_idx + 2] + '\n              })()}' + content[close_idx + 2:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Successfully sorted family members listing!')

if __name__ == '__main__':
    main()

import json
import os
import subprocess

def flexible_replace(file_content, target, replacement, start_line=None, end_line=None):
    # Normalize line endings
    target = target.replace('\r\n', '\n')
    replacement = replacement.replace('\r\n', '\n')
    file_content = file_content.replace('\r\n', '\n')

    file_lines = file_content.split('\n')

    # If start_line and end_line are provided, restrict search range with 100-line wiggle room
    if start_line is not None and end_line is not None:
        s_idx = max(0, start_line - 1 - 100)
        e_idx = min(len(file_lines), end_line + 100)
    else:
        s_idx = 0
        e_idx = len(file_lines)

    # Indentation-insensitive search
    target_lines = [line.strip() for line in target.split('\n')]
    # Remove empty trailing/leading lines from target for matching
    while target_lines and not target_lines[0]:
        target_lines.pop(0)
    while target_lines and not target_lines[-1]:
        target_lines.pop()

    if not target_lines:
        return file_content

    target_len = len(target_lines)

    # Search within the wiggled range first
    for i in range(s_idx, min(e_idx - target_len + 1, len(file_lines) - target_len + 1)):
        match = True
        for j in range(target_len):
            if file_lines[i + j].strip() != target_lines[j]:
                match = False
                break
        if match:
            new_lines = file_lines[:i] + replacement.split('\n') + file_lines[i + target_len:]
            return '\n'.join(new_lines)

    # Fallback to searching the whole file
    for i in range(len(file_lines) - target_len + 1):
        match = True
        for j in range(target_len):
            if file_lines[i + j].strip() != target_lines[j]:
                match = False
                break
        if match:
            new_lines = file_lines[:i] + replacement.split('\n') + file_lines[i + target_len:]
            return '\n'.join(new_lines)

    return None

def main():
    # 1. Reset page.tsx using git
    print("Reverting page.tsx to git HEAD...")
    subprocess.run(["git", "checkout", "HEAD", "--", "app/manage/page.tsx"], check=True)

    log_path = '/Users/ole/.gemini/antigravity/brain/cc7b7d11-73fb-4963-90b7-d1c1640eff7e/.system_generated/logs/transcript_full.jsonl'
    if not os.path.exists(log_path):
        print("Log path not found!")
        return

    # 2. Extract edits after step 2284
    edits = []
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                step = data.get('step_index')
                if step is not None and step >= 2284:
                    if 'tool_calls' in data:
                        for tc in data['tool_calls']:
                            args = tc.get('args', {})
                            target = args.get('TargetFile', '') or args.get('Target', '')
                            if 'app/manage/page.tsx' in target:
                                edits.append({
                                    'step': step,
                                    'tool': tc.get('name'),
                                    'args': args
                                })
            except Exception as e:
                pass

    # Sort edits by step index
    edits.sort(key=lambda x: x['step'])
    print(f"Applying {len(edits)} edits chronologically...")

    # Read current page.tsx content
    with open('app/manage/page.tsx', 'r', encoding='utf-8') as f:
        file_content = f.read()

    for edit in edits:
        step = edit['step']
        tool = edit['tool']
        args = edit['args']
        desc = args.get('Description', '')

        # Intercept Step 2482 Chunk 5 to target the exact relationship select closing tag
        if step == 2482 and tool == 'multi_replace_file_content':
            chunks = args.get('ReplacementChunks', [])
            if len(chunks) >= 5:
                c5 = chunks[4]
                if c5.get('TargetContent').strip() == '</div>\n              </div>'.strip():
                    print("  [INTERCEPT] Enhancing Step 2482 Chunk 5 target content...")
                    c5['TargetContent'] = """
                    <option value="PARENT_1">บิดา (Father)</option>
                    <option value="PARENT_2">มารดา (Mother)</option>
                    <option value="SPOUSE">คู่สมรส (Spouse)</option>
                    <option value="SIBLING">พี่น้อง (Sibling)</option>
                    <option value="CHILD">บุตร/ธิดา (Child)</option>
                  </select>
                </div>
              </div>
                    """.strip()
                    c5['ReplacementContent'] = """
                    <option value="PARENT_1">บิดา (Father)</option>
                    <option value="PARENT_2">มารดา (Mother)</option>
                    <option value="SPOUSE">คู่สมรส (Spouse)</option>
                    <option value="SIBLING">พี่น้อง (Sibling)</option>
                    <option value="CHILD">บุตร/ธิดา (Child)</option>
                  </select>
                </div>
              </div>

              {(familyRelationship === 'SON_IN_LAW' || familyRelationship === 'DAUGHTER_IN_LAW') && (
                <div className="space-y-1 mt-3">
                  <label className="text-sm font-bold text-stone-600 block">
                    เป็นคู่สมรสของลูกคนไหน? <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    value={familySpouseOfId}
                    onChange={(e) => setFamilySpouseOfId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-stone-250 rounded-xl text-stone-900 text-sm sm:text-base focus:outline-none focus:border-emerald-500/80 transition"
                  >
                    <option value="">-- กรุณาเลือกทายาท/ลูก --</option>
                    {familyMembers
                      .filter(m => m.relationship === 'CHILD' && m.id !== familyId)
                      .map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                  </select>
                  {familyMembers.filter(m => m.relationship === 'CHILD').length === 0 && (
                    <p className="text-xs text-amber-600 font-semibold mt-1">
                      ⚠️ ยังไม่มีรายชื่อลูกในระบบ กรุณาบันทึกข้อมูลของ "บุตร/ธิดา" ก่อนเพิ่มคู่สมรสค่ะ
                    </p>
                  )}
                </div>
              )}
                    """.strip()

        # Intercept Step 4353 to place Gallery Manager at the end of the file, not in the middle of settings form
        if step == 4353 and tool == 'replace_file_content':
            print("  [INTERCEPT] Directing Gallery Manager card to the end of the page...")
            args['TargetContent'] = """
            </div>
          )}
        </section>
      </main>
            """.strip()
            # Wrap the replacement to insert Gallery section before </main>, keeping </main>
            args['ReplacementContent'] = args['ReplacementContent'].replace(
                "          </div>\n        </div>",
                "            </div>\n          )}\n        </section>"
            ) + "\n      </main>"

        # Intercept Step 7014 Chunk 4 to fix the Database icon className mismatch
        if step == 7014 and tool == 'multi_replace_file_content':
            chunks = args.get('ReplacementChunks', [])
            if len(chunks) >= 4:
                c4 = chunks[3]
                if 'Database' in c4.get('TargetContent'):
                    print("  [INTERCEPT] Fixing Step 7014 Chunk 4 Database icon className...")
                    c4['TargetContent'] = c4['TargetContent'].replace(
                        '<Database className="w-4.5 h-4.5 text-stone-700" />',
                        '<Database className="w-4 h-4 text-emerald-700" />'
                    )

        # Intercept Step 7082 to correct the tab page wrapping order
        if step == 7082 and tool == 'multi_replace_file_content':
            print("  [INTERCEPT] Adjusting Step 7082 tab division chunks...")
            chunks = args.get('ReplacementChunks', [])
            
            # Chunk 4: settings -> family
            chunks[3]['TargetContent'] = """
            </form>
          </div>

          {/* Family Tree Manager Section */}
          <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
            """.strip()
            chunks[3]['ReplacementContent'] = """
            </form>
          </div>
          )}

          {activeTab === 'family' && (
            <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-stone-100 pb-4">
            """.strip()

            # Chunk 5: disable/skip it
            chunks[4]['TargetContent'] = "DUMMY_STRING_THAT_SHOULD_NOT_EXIST"
            chunks[4]['ReplacementContent'] = ""

            # Chunk 8 (billing -> condolences) remains as-is.

            # Chunk 9 (condolences -> end) needs to close condolences, and open gallery
            chunks[8]['TargetContent'] = """
            {/* Memorial Gallery Manager Section */}
            <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-100 pb-4">
            """.strip()
            chunks[8]['ReplacementContent'] = """
            </>
            )}

            {activeTab === 'gallery' && (
              <section className="p-6 rounded-3xl border border-stone-200 bg-white shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-100 pb-4">
            """.strip()

            # We need to append a new chunk to close the gallery tab wrapper at the end of the file
            chunks.append({
                'TargetContent': """
                </section>
              </main>
                """.strip(),
                'ReplacementContent': """
                </section>
                )}
              </main>
                """.strip(),
                'StartLine': 3450,
                'EndLine': 3650
            })

        print(f"Applying Step {step} ({tool}): {desc}")

        if tool == 'replace_file_content':
            target = args.get('TargetContent')
            replacement = args.get('ReplacementContent')
            start_line = args.get('StartLine')
            end_line = args.get('EndLine')
            if not target or replacement is None:
                print(f"  [ERROR] Step {step}: Missing target or replacement.")
                continue

            new_content = flexible_replace(file_content, target, replacement, start_line, end_line)
            if new_content is None:
                print(f"  [WARNING] Step {step}: Target content not found! Skipping...")
            else:
                file_content = new_content
                print(f"  [SUCCESS] Step {step}: Applied.")

        elif tool == 'multi_replace_file_content':
            chunks = args.get('ReplacementChunks', [])
            for idx, chunk in enumerate(chunks):
                target = chunk.get('TargetContent')
                replacement = chunk.get('ReplacementContent')
                start_line = chunk.get('StartLine')
                end_line = chunk.get('EndLine')
                if not target or replacement is None:
                    print(f"  [ERROR] Step {step} Chunk {idx+1}: Missing target or replacement.")
                    continue

                new_content = flexible_replace(file_content, target, replacement, start_line, end_line)
                if new_content is None:
                    print(f"  [WARNING] Step {step} Chunk {idx+1}: Target content not found! Skipping...")
                else:
                    file_content = new_content
                    print(f"  [SUCCESS] Step {step} Chunk {idx+1}: Applied.")

    # Save the reconstructed file
    with open('app/manage/page.tsx', 'w', encoding='utf-8') as f:
        f.write(file_content)

    print("\nReconstruction complete!")

if __name__ == '__main__':
    main()

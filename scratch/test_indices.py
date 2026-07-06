with open('/Users/ole/ForeverProject/app/manage/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

lines = []
lines.append('Initial: ' + str(len(content)))
grid_start = content.find('        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">')
grid_end = content.find('        {/* Family Tree Manager Section */}', grid_start)
content = content.replace(content[grid_start:grid_end], '{SETTINGS_PLACEHOLDER}')
lines.append('After grid replace: ' + str(len(content)))

family_comment = '        {/* Family Tree Manager Section */}'
family_start = content.find(family_comment)
section_start = content.find('<section', family_start)
family_end = content.find('        {/* E-Books Manager Section */}', family_start)

lines.append('family_start: ' + str(family_start) + ' section_start: ' + str(section_start) + ' family_end: ' + str(family_end))
family_target = content[family_start:family_end]
family_repl = family_comment + "\n        {activeTab === 'family' && (\n          " + content[section_start:family_end].strip() + "\n        )}"

lines.append('Is family_target in content? ' + str(family_target in content))
content = content.replace(family_target, family_repl)
lines.append('After family replace: ' + str(len(content)))

ebook_comment = '        {/* E-Books Manager Section */}'
ebook_start = content.find(ebook_comment)
ebook_section_start = content.find('<section', ebook_start)
ebook_end = content.find('        {/* Condolence moderation */}', ebook_start)
lines.append('ebook_start: ' + str(ebook_start) + ' ebook_section_start: ' + str(ebook_section_start) + ' ebook_end: ' + str(ebook_end))

ebook_target = content[ebook_start:ebook_end]
ebook_repl = ebook_comment + "\n        {activeTab === 'ebooks' && (\n          " + content[ebook_section_start:ebook_end].strip() + "\n        )}"
lines.append('Is ebook_target in content? ' + str(ebook_target in content))
content = content.replace(ebook_target, ebook_repl)
lines.append('After ebook replace: ' + str(len(content)))

condo_comment = '        {/* Condolence moderation */}'
condo_start = content.find(condo_comment)
condo_section_start = content.find('<section', condo_start)
condo_end = content.find('      </main>', condo_start)
lines.append('condo_start: ' + str(condo_start) + ' condo_section_start: ' + str(condo_section_start) + ' condo_end: ' + str(condo_end))

with open('/Users/ole/ForeverProject/scratch/test_output.txt', 'w', encoding='utf-8') as out_f:
    out_f.write('\n'.join(lines))

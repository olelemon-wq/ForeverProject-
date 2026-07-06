import os

manage_file = "/Users/ole/ForeverProject/app/manage/page.tsx"

with open(manage_file, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Gallery close block
gallery_target = "                  </div>\n                );\n              })})()}"
gallery_repl = "                  </div>\n                );\n              })}"
content = content.replace(gallery_target, gallery_repl)

# Fix 2: Family tree close block
family_target = "              })}\n              })()}"
family_repl = "              })})()}"
content = content.replace(family_target, family_repl)

with open(manage_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Braces fixed!")

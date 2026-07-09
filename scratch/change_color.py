import re

file_path = "/Users/ole/ForeverProject/app/(marketing)/page.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace #0F6E56 with #0071e3
new_content = content.replace("#0F6E56", "#0071e3")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully replaced green hex colors with royal blue hex colors in page.tsx")

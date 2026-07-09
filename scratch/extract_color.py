from PIL import Image
import collections

img_path = "/Users/ole/.gemini/antigravity/brain/934f6d46-8147-4127-927b-b37a8cadd184/media__1783583291690.png"

try:
    img = Image.open(img_path)
    img = img.convert('RGB')
    colors = img.getdata()
    
    # We want to find a dominant blue color (where B is high and G is moderate, R is low)
    blue_colors = []
    for r, g, b in colors:
        # Check if it is a strong blue color
        if b > 150 and b > r * 1.5 and b > g * 1.1:
            blue_colors.append((r, g, b))
            
    if blue_colors:
        counter = collections.Counter(blue_colors)
        most_common = counter.most_common(5)
        print("Dominant Blue Colors (R, G, B) -> Hex:")
        for rgb, count in most_common:
            hex_color = '#{:02x}{:02x}{:02x}'.format(*rgb)
            print(f"  {rgb} -> {hex_color} (count: {count})")
    else:
        print("No strong blue color detected in image pixels.")
except Exception as e:
    print(f"Error: {e}")

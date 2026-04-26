from PIL import Image

def remove_white_bg(img_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    
    for r, g, b, a in data:
        # If pixels are too close to pure white, convert them to fully transparent
        if r > 245 and g > 245 and b > 245:
            new_data.append((255, 255, 255, 0))
        # Handle the transition/aliasing area (anti-aliasing)
        elif r > 200 and g > 200 and b > 200:
            avg = (r + g + b) / 3.0
            # Linearly scale alpha based on how close it is to white
            alpha = int(255 - ((avg - 200) / 45.0) * 255)
            # Ensure it doesn't go below 0 or above 255
            alpha = max(0, min(255, alpha))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, a))
            
    img.putdata(new_data)
    img.save(img_path, "PNG")

if __name__ == "__main__":
    remove_white_bg('images/shanyrak.png')
    print("Background removed successfully")

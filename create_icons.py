"""
Simple script to create placeholder PNG icons for the browser extension.
Run this script if you don't have icon files yet.

Requirements: pip install pillow
Usage: python create_icons.py
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """Create a simple gradient icon with a bookmark symbol"""
    
    # Create image with gradient background
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)
    
    # Draw gradient background (purple to blue)
    for y in range(size):
        # Calculate color for this row
        ratio = y / size
        r = int(102 + (118 - 102) * ratio)
        g = int(126 + (75 - 126) * ratio)
        b = int(234 + (162 - 234) * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    # Draw rounded rectangle for modern look
    border_radius = size // 6
    
    # Draw bookmark shape
    bookmark_width = size // 2
    bookmark_height = int(size * 0.6)
    bookmark_x = (size - bookmark_width) // 2
    bookmark_y = int(size * 0.2)
    
    # Bookmark background (white)
    points = [
        (bookmark_x, bookmark_y),
        (bookmark_x + bookmark_width, bookmark_y),
        (bookmark_x + bookmark_width, bookmark_y + bookmark_height),
        (bookmark_x + bookmark_width // 2, bookmark_y + bookmark_height - bookmark_width // 4),
        (bookmark_x, bookmark_y + bookmark_height),
    ]
    draw.polygon(points, fill='white', outline='white')
    
    # Add a star if icon is large enough
    if size >= 48:
        star_x = size // 2
        star_y = int(size * 0.45)
        star_size = size // 8
        
        # Simple circle as star
        draw.ellipse([
            star_x - star_size,
            star_y - star_size,
            star_x + star_size,
            star_y + star_size
        ], fill='gold')
    
    # Save the icon
    img.save(output_path, 'PNG')
    print(f"Created: {output_path} ({size}x{size})")

def main():
    """Create all required icon sizes"""
    
    # Get the icons directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    icons_dir = os.path.join(script_dir, 'icons')
    
    # Create icons directory if it doesn't exist
    os.makedirs(icons_dir, exist_ok=True)
    
    # Icon sizes required by browser extensions
    sizes = [16, 32, 48, 128]
    
    print("Creating placeholder icons...")
    print("-" * 40)
    
    for size in sizes:
        output_path = os.path.join(icons_dir, f'icon{size}.png')
        create_icon(size, output_path)
    
    print("-" * 40)
    print("✓ All icons created successfully!")
    print(f"\nIcons saved in: {icons_dir}")
    print("\nYou can now load the extension in your browser.")
    print("For better icons, consider using a design tool like Figma or Canva.")

if __name__ == '__main__':
    try:
        main()
    except ImportError:
        print("Error: Pillow library not found.")
        print("Install it with: pip install pillow")
    except Exception as e:
        print(f"Error: {e}")
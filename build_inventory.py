import os
import json
import csv
import re

inventory = {
    "standard_bingo": [],
    "trivia_bingo": []
}

def parse_csv(csv_path):
    data = []
    try:
        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                data.append(row)
    except UnicodeDecodeError:
        try:
            with open(csv_path, 'r', encoding='windows-1252') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    data.append(row)
        except Exception as e:
            print(f"Error reading {csv_path} with windows-1252 fallback: {e}")
    except Exception as e:
        print(f"Error reading {csv_path}: {e}")
        
    return data

public_dir = "public"

for root, dirs, files in os.walk(public_dir):
    mp3_files = [f for f in files if f.endswith('.mp3')]
    
    if mp3_files:
        folder_path = os.path.relpath(root, public_dir).replace('\\', '/')
        path_parts = folder_path.split('/')
        
        # Determine Game Type
        game_type = "standard_bingo" if "standard" in folder_path.lower() or "number" in folder_path.lower() else "trivia_bingo"
        
        # Determine Model (V2 or V3)
        model = "V3"
        if "v2" in folder_path.lower():
            model = "V2"
        
        # --- SMART NAME EXTRACTION ---
        raw_name = path_parts[-1]
        
        # 1. Remove leading numbers and underscores (e.g., "00_", "01 ")
        clean_name = re.sub(r'^\d+[_ -]*', '', raw_name)
        
        # 2. Remove trailing model tags (e.g., "_V2-MODEL", " V3 Model", "-v2")
        clean_name = re.sub(r'[_ -]*V[23]([- ]?MODEL)?$', '', clean_name, flags=re.IGNORECASE)
        
        character = clean_name.strip()
        if not character:
            character = "Unknown"
            
        # Find local CSV
        csv_files = [f for f in files if f.endswith('.csv')]
        csv_data = []
        if csv_files:
            csv_data = parse_csv(os.path.join(root, csv_files[0]))
            
        game_id = f"{character}_{model}".upper().replace(' ', '_')
        
        inventory[game_type].append({
            "id": game_id,
            "character_or_theme": character,
            "model": model,
            "path": folder_path,
            "audio_files": mp3_files,
            "csv_data": csv_data
        })

# Write out the JSON
output_path = os.path.join("src", "data", "inventory.json")
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding='utf-8') as f:
    json.dump(inventory, f, indent=2)

print(f"Success! Rebuilt inventory.json with {len(inventory['standard_bingo'])} Standard and {len(inventory['trivia_bingo'])} Trivia records.")
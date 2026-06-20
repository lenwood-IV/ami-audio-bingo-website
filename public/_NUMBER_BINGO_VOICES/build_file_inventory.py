import os
import json
import csv

# The base directories based on your screenshots
BASE_DIRS = [
    "10.20.25_AMI_MUSIC_BINGO_RESTART/_NUMBER_BINGO_VOICES",
    "10.20.25_AMI_MUSIC_BINGO_RESTART/_TRIVIA_BINGO_GAMES"
]

inventory = {
    "standard_bingo": [],
    "trivia_bingo": []
}

def scan_directory():
    for base_dir in BASE_DIRS:
        if not os.path.exists(base_dir):
            print(f"Skipping {base_dir} - not found.")
            continue
            
        game_type = "standard_bingo" if "NUMBER" in base_dir else "trivia_bingo"
        
        for folder_name in os.listdir(base_dir):
            folder_path = os.path.join(base_dir, folder_name)
            
            if os.path.isdir(folder_path):
                # Extract metadata from folder name (e.g., 00_UNCLE_BULL_V2-MODEL)
                is_v3 = "V3" in folder_name.upper()
                model_version = "V3" if is_v3 else "V2"
                
                folder_data = {
                    "id": folder_name,
                    "character_or_theme": folder_name.replace("_V2-MODEL", "").replace("_V3-MODEL", "").split("_", 1)[-1],
                    "model": model_version,
                    "path": folder_path,
                    "audio_files": [],
                    "csv_data": []
                }
                
                # Scan for MP3s and CSVs
                for file in os.listdir(folder_path):
                    if file.endswith(".mp3"):
                        folder_data["audio_files"].append(file)
                    elif file.endswith(".csv"):
                        csv_path = os.path.join(folder_path, file)
                        try:
                            with open(csv_path, mode='r', encoding='utf-8-sig') as c:
                                reader = csv.DictReader(c)
                                folder_data["csv_data"] = list(reader)
                        except Exception as e:
                            # Fallback encoding if Excel messed it up
                            try:
                                with open(csv_path, mode='r', encoding='cp1252') as c:
                                    reader = csv.DictReader(c)
                                    folder_data["csv_data"] = list(reader)
                            except Exception as e2:
                                print(f"Could not read CSV {file}: {e2}")

                inventory[game_type].append(folder_data)

    # Save to a cleanly formatted JSON file
    with open("inventory.json", "w", encoding='utf-8') as f:
        json.dump(inventory, f, indent=4)
        
    print("✅ Successfully generated inventory.json!")

if __name__ == "__main__":
    scan_directory()
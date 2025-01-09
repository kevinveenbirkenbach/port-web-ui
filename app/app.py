import os
from flask import Flask, render_template
import requests
import hashlib
import yaml

# Verzeichnis mit Dateien, die gelöscht werden sollen
TEMP_DIR = "static/cache/"

def delete_temp_files():
    if os.path.exists(TEMP_DIR):
        for filename in os.listdir(TEMP_DIR):
            file_path = os.path.join(TEMP_DIR, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
                print(f"Gelöscht: {file_path}")
    else:
        os.makedirs(TEMP_DIR)  # Erstelle das Verzeichnis, falls es nicht existiert
        print(f"Erstellt: {TEMP_DIR}")

# Löschen der Dateien beim App-Start
delete_temp_files()

def cache_file(file_url, cache_dir=TEMP_DIR):
    """Lädt ein Icon herunter und speichert es lokal, wenn es nicht existiert. Fügt einen Hash hinzu."""
    # Erstelle das Verzeichnis, falls es nicht existiert
    os.makedirs(cache_dir, exist_ok=True)
    
    # Generiere einen 8-Zeichen-Hash basierend auf der URL
    hash_object = hashlib.blake2s(file_url.encode('utf-8'), digest_size=8)
    hash_suffix = hash_object.hexdigest()
    
    splitted_file_url = file_url.split("/");
    
    if splitted_file_url[-1] == "download":
        # Erstelle den Dateinamen mit Hash
        base_name = splitted_file_url[-2]
    else:
        base_name = splitted_file_url[-1]
    filename = f"{base_name}_{hash_suffix}.png"
    full_path = os.path.join(cache_dir, filename)
    
    # Wenn die Datei existiert, überspringe den Download
    if os.path.exists(full_path):
        return full_path

    # Lade die Datei herunter
    response = requests.get(file_url, stream=True)
    if response.status_code == 200:
        with open(full_path, "wb") as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
    return full_path

def load_config(app):
    # Lade die Konfigurationsdatei
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)
    app.config.update(config)

app = Flask(__name__)
load_config(app)

# Hole die Umgebungsvariable FLASK_ENV oder setze einen Standardwert
FLASK_ENV = os.getenv("FLASK_ENV", "production")
    
@app.before_request
def reload_config_in_dev():
    if FLASK_ENV == "development":
        load_config(app)
        
    # Cachen der Icons
    for card in app.config["cards"]:
        card["icon"]["cache"] = cache_file(card["icon"]["source"])
    
    app.config["company"]["logo"]["cache"] = cache_file(app.config["company"]["logo"]["source"])
    app.config["company"]["favicon"]["cache"] = cache_file(app.config["company"]["favicon"]["source"])

@app.route('/')
def index():
    return render_template("pages/index.html.j2", cards=app.config["cards"], company=app.config["company"], navigation=app.config["navigation"])

if __name__ == "__main__":
    app.run(debug=(FLASK_ENV == "development"), host="0.0.0.0", port=5000)
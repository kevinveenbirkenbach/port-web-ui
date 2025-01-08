import json
import os
from flask import Flask, render_template
import requests
import hashlib

def cache_icon(icon_url, cache_dir="static/logos"):
    """Lädt ein Icon herunter und speichert es lokal, wenn es nicht existiert. Fügt einen Hash hinzu."""
    # Erstelle das Verzeichnis, falls es nicht existiert
    os.makedirs(cache_dir, exist_ok=True)
    
    # Generiere einen 8-Zeichen-Hash basierend auf der URL
    hash_object = hashlib.blake2s(icon_url.encode('utf-8'), digest_size=8)
    hash_suffix = hash_object.hexdigest()
    
    # Erstelle den Dateinamen mit Hash
    base_name = icon_url.split("/")[-2]
    filename = f"{base_name}_{hash_suffix}.png"
    full_path = os.path.join(cache_dir, filename)
    
    # Wenn die Datei existiert, überspringe den Download
    if os.path.exists(full_path):
        return full_path

    # Lade die Datei herunter
    response = requests.get(icon_url, stream=True)
    if response.status_code == 200:
        with open(full_path, "wb") as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
    return full_path


app = Flask(__name__)

# Hole die Umgebungsvariable FLASK_ENV oder setze einen Standardwert
FLASK_ENV = os.getenv("FLASK_ENV", "production")

config_data = None  # Globale Variable für die Konfiguration

def load_config():
    """Lädt die Konfiguration aus der JSON-Datei."""
    with open("config.json", "r") as config_file:
        return json.load(config_file)

@app.before_request
def reload_config_in_dev():
    """Lädt die Datei bei jedem Request neu im Dev-Modus."""
    global config_data
    if FLASK_ENV == "development" or config_data is None:
        config_data = load_config()
        
    # Cachen der Icons
    for card in config_data["cards"]:
        card["icon"] = cache_icon(card["icon"])

@app.route('/')
def index():
    return render_template("pages/index.html.j2", cards=config_data.get("cards", []), networks=config_data.get("networks", []), company=config_data["company"], navigation=config_data["navigation"])

if __name__ == "__main__":
    app.run(debug=(FLASK_ENV == "development"), host="0.0.0.0", port=5000)
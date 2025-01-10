import os
from flask import Flask, render_template
import requests
import hashlib
import yaml
from utils.configuration_resolver import ConfigurationResolver
from utils.cache_manager import CacheManager

# Initialize the CacheManager
cache_manager = CacheManager()

# Clear cache on startup
cache_manager.clear_cache()

def load_config(app):
    """Load and resolve the configuration."""
    # Lade die Konfigurationsdatei
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)

    # Resolve links in the configuration
    resolver = ConfigurationResolver(config)
    resolver.resolve_links()
    # Update the app configuration
    app.config.update(resolver.get_config())

app = Flask(__name__)
load_config(app)

# Hole die Umgebungsvariable FLASK_ENV oder setze einen Standardwert
FLASK_ENV = os.getenv("FLASK_ENV", "production")
    
@app.before_request
def reload_config_in_dev():
    if FLASK_ENV == "development":
        load_config(app)
        
    # Cache the icons
    for card in app.config["cards"]:
        card["icon"]["cache"] = cache_manager.cache_file(card["icon"]["source"])
    
    app.config["company"]["logo"]["cache"] = cache_manager.cache_file(app.config["company"]["logo"]["source"])
    app.config["company"]["favicon"]["cache"] = cache_manager.cache_file(app.config["company"]["favicon"]["source"])

@app.route('/')
def index():
    return render_template("pages/index.html.j2", cards=app.config["cards"], company=app.config["company"], navigation=app.config["navigation"])

if __name__ == "__main__":
    app.run(debug=(FLASK_ENV == "development"), host="0.0.0.0", port=5000)

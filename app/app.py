import os
from flask import Flask, render_template
import yaml
from utils.configuration_resolver import ConfigurationResolver
from utils.cache_manager import CacheManager
from utils.compute_card_classes import compute_card_classes

# Initialize the CacheManager
cache_manager = CacheManager()

# Clear cache on startup
cache_manager.clear_cache()

def load_config(app):
    """Load and resolve the configuration from config.yaml."""
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)

    resolver = ConfigurationResolver(config)
    resolver.resolve_links()
    app.config.update(resolver.get_config())

def cache_icons_and_logos(app):
    """Cache all icons and logos to local files."""
    for card in app.config["cards"]:
        icon = card.get("icon", {})
        if icon.get("source"):
            icon["cache"] = cache_manager.cache_file(icon["source"])

    app.config["company"]["logo"]["cache"] = cache_manager.cache_file(app.config["company"]["logo"]["source"])
    app.config["platform"]["favicon"]["cache"] = cache_manager.cache_file(app.config["platform"]["favicon"]["source"])
    app.config["platform"]["logo"]["cache"] = cache_manager.cache_file(app.config["platform"]["logo"]["source"])

# Get the environment variable FLASK_ENV or set a default value
FLASK_ENV = os.getenv("FLASK_ENV", "production")

# Initialize Flask app
app = Flask(__name__)

# Load configuration and cache assets on startup
load_config(app)
cache_icons_and_logos(app)

@app.before_request
def reload_config_in_dev():
    """Reload config and recache icons before each request in development mode."""
    if FLASK_ENV == "development":
        load_config(app)
        cache_icons_and_logos(app)

@app.route('/')
def index():
    """Render the main index page."""
    cards = app.config["cards"]
    lg_classes, md_classes = compute_card_classes(cards)
    return render_template(
        "pages/index.html.j2",
        cards=cards,
        company=app.config["company"],
        navigation=app.config["navigation"],
        platform=app.config["platform"],
        lg_classes=lg_classes,
        md_classes=md_classes
    )

if __name__ == "__main__":
    app.run(debug=(FLASK_ENV == "development"), host="0.0.0.0", port=5000)

import os
import hashlib
import requests
import mimetypes

class CacheManager:
    def __init__(self, cache_dir="static/cache"):
        self.cache_dir = cache_dir
        self._ensure_cache_dir_exists()

    def _ensure_cache_dir_exists(self):
        """Ensure the cache directory exists on disk."""
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)

    def clear_cache(self):
        """Remove all files from the cache directory."""
        if os.path.exists(self.cache_dir):
            for filename in os.listdir(self.cache_dir):
                file_path = os.path.join(self.cache_dir, filename)
                if os.path.isfile(file_path):
                    os.remove(file_path)

    def cache_file(self, file_url):
        """
        Download a file from `file_url` and store it in the cache.
        If any HTTP error occurs, return "Undefined" instead of raising.
        """
        # Compute a short hash suffix for the URL
        hash_object = hashlib.blake2s(file_url.encode('utf-8'), digest_size=8)
        hash_suffix = hash_object.hexdigest()

        # Derive a base filename: drop trailing 'download' if present
        url_parts = file_url.rstrip("/").split("/")
        base_name = url_parts[-2] if url_parts[-1] == "download" else url_parts[-1]

        try:
            # Attempt to download the file (streaming)
            response = requests.get(file_url, stream=True)
            response.raise_for_status()
        except requests.RequestException:
            # On any network/HTTP error, skip caching and return "Undefined"
            return "Undefined"

        # Determine file extension from Content-Type header
        content_type = response.headers.get('Content-Type', '')
        extension = mimetypes.guess_extension(content_type.split(";")[0].strip())
        if extension is None:
            extension = '.png'  # default extension

        # Build final filename and full path
        filename = f"{base_name}_{hash_suffix}{extension}"
        full_path = os.path.join(self.cache_dir, filename)

        # Write the file to cache if not already present
        if not os.path.exists(full_path):
            with open(full_path, "wb") as out_file:
                for chunk in response.iter_content(chunk_size=1024):
                    out_file.write(chunk)

        return full_path

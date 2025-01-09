import os
import hashlib
import requests

class CacheManager:
    """
    A class to manage caching of files, including creating temporary directories
    and caching files locally with hashed filenames.
    """

    def __init__(self, cache_dir="static/cache"):
        """
        Initialize the CacheManager with a cache directory.

        :param cache_dir: The directory where cached files will be stored.
        """
        self.cache_dir = cache_dir
        self._ensure_cache_dir_exists()

    def _ensure_cache_dir_exists(self):
        """
        Ensure the cache directory exists. If it doesn't, create it.
        """
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)
            print(f"Created cache directory: {self.cache_dir}")

    def clear_cache(self):
        """
        Clear all files in the cache directory.
        """
        if os.path.exists(self.cache_dir):
            for filename in os.listdir(self.cache_dir):
                file_path = os.path.join(self.cache_dir, filename)
                if os.path.isfile(file_path):
                    os.remove(file_path)
                    print(f"Deleted: {file_path}")

    def cache_file(self, file_url):
        """
        Download a file and store it locally in the cache directory with a hashed filename.

        :param file_url: The URL of the file to cache.
        :return: The local path of the cached file.
        """
        # Generate a hashed filename based on the URL
        hash_object = hashlib.blake2s(file_url.encode('utf-8'), digest_size=8)
        hash_suffix = hash_object.hexdigest()

        # Determine the base name for the file
        splitted_file_url = file_url.split("/")
        base_name = splitted_file_url[-2] if splitted_file_url[-1] == "download" else splitted_file_url[-1]

        # Construct the full path for the cached file
        filename = f"{base_name}_{hash_suffix}.png"
        full_path = os.path.join(self.cache_dir, filename)

        # If the file already exists, return the cached path
        if os.path.exists(full_path):
            return full_path

        # Download the file and save it locally
        response = requests.get(file_url, stream=True)
        if response.status_code == 200:
            with open(full_path, "wb") as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
        return full_path

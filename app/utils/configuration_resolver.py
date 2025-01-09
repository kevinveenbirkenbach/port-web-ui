class ConfigurationResolver:
    """
    A class to resolve `link` entries in a nested configuration structure.
    Supports navigation through dictionaries, lists, and `subitems`.
    """

    def __init__(self, config):
        self.config = config

    def resolve_links(self):
        """
        Resolves all `link` entries in the configuration.
        """
        self._recursive_resolve(self.config, self.config)

    def _recursive_resolve(self, current_config, root_config):
        """
        Recursively resolves `link` entries in the configuration.
        """
        if isinstance(current_config, dict):
            for key, value in list(current_config.items()):
                if key == "link":
                    try:
                        target = self._find_entry(root_config, value.lower())
                        current_config.clear()
                        current_config.update(target)
                    except Exception as e:
                        raise ValueError(
                            f"Error resolving link '{value}': {str(e)}. "
                            f"Current path: {key}, Current config: {current_config}"
                        )
                else:
                    self._recursive_resolve(value, root_config)
        elif isinstance(current_config, list):
            for item in current_config:
                self._recursive_resolve(item, root_config)

    def _find_entry(self, config, path):
        """
        Finds an entry in the configuration by a dot-separated path.
        Supports both dictionaries and lists with `subitems` navigation.
        """
        parts = path.split('.')
        current = config
        for part in parts:
            if isinstance(current, list):
                # Look for a matching name in the list
                found = next(
                    (item for item in current if isinstance(item, dict) and item.get("name", "").lower() == part),
                    None
                )
                if found is None:
                    raise ValueError(
                        f"No matching entry for '{part}' in list. Path so far: {' > '.join(parts[:parts.index(part)+1])}. "
                        f"Current list: {current}"
                    )
                current = found
            elif isinstance(current, dict):
                # Case-insensitive dictionary lookup
                key = next((k for k in current if k.lower() == part), None)
                if key is None:
                    raise KeyError(
                        f"Key '{part}' not found in dictionary. Path so far: {' > '.join(parts[:parts.index(part)+1])}. "
                        f"Current dictionary: {current}"
                    )
                current = current[key]
            else:
                raise ValueError(
                    f"Invalid path segment '{part}'. Current type: {type(current)}. "
                    f"Path so far: {' > '.join(parts[:parts.index(part)+1])}"
                )

            # Navigate into `subitems` if present
            if isinstance(current, dict) and "subitems" in current:
                current = current["subitems"]

        return current

    def get_config(self):
        """
        Returns the resolved configuration.
        """
        return self.config

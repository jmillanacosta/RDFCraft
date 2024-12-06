from abc import ABC, abstractmethod


class ConfigServiceProtocol(ABC):
    @abstractmethod
    def get(self, key: str) -> str | None:
        """
        Get a value from the config

        Args:
            key (str): key to get

        Returns:
            str | None: value of the key, or None if not found
        """
        ...

    @abstractmethod
    def set(self, key: str, value: str):
        """
        Set a value in the config

        Args:
            key (str): key to set
            value (str): value to
        """
        ...

    @abstractmethod
    def delete(self, key: str):
        """
        Delete a value from the config

        Args:
            key (str): key to delete
        """
        ...

from typing import Protocol


class ConfigService(Protocol):
    def get(self, key: str) -> str | None: ...

    def set(self, key: str, value: str): ...

    def delete(self, key: str): ...

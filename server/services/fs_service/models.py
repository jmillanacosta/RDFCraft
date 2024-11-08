from dataclasses import dataclass
from pathlib import Path


@dataclass
class Directory:
    name: str
    path: Path
    files: list[Path]
    directories: list[Path]

from enum import Enum


class ErrCodes(Enum):
    # FS Service
    FILE_NOT_FOUND = 0
    FILE_CORRUPTED = 1

    # Workspace Metadata Service
    WORKSPACE_METADATA_NOT_FOUND = 20
    WORKSPACE_METADATA_EXISTS = 21
    WORKSPACE_METADATA_ILLEGAL_UPDATE_OPERATION = 22

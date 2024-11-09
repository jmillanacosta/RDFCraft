from enum import Enum


class ErrCodes(Enum):
    # FS Service
    DANGEROUS_PATH = 0
    DOES_NOT_EXIST = 1
    NOT_A_FILE = 2
    NOT_A_DIR = 3
    FILE_EXISTS = 4
    DIR_EXISTS = 5

    # Workspace Metadata Service
    WORKSPACE_METADATA_NOT_FOUND = 20
    WORKSPACE_METADATA_EXISTS = 21
    WORKSPACE_METADATA_ILLEGAL_UPDATE_OPERATION = 22

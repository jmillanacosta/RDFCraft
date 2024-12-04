from enum import Enum


class ErrCodes(Enum):
    # General
    UNKNOWN_ERROR = -1
    NOT_IMPLEMENTED = -2
    # FS Service
    FILE_NOT_FOUND = 0
    FILE_CORRUPTED = 1

    # Workspace Metadata Service
    WORKSPACE_METADATA_NOT_FOUND = 20
    WORKSPACE_METADATA_EXISTS = 21
    WORKSPACE_METADATA_ILLEGAL_UPDATE_OPERATION = 22

    # Ontology Service
    ONTOLOGY_NOT_FOUND = 40

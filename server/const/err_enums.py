from enum import Enum


class FSServiceErrs(Enum):
    DANGEROUS_PATH = 0
    DOES_NOT_EXIST = 1
    NOT_A_FILE = 2
    NOT_A_DIR = 3
    FILE_EXISTS = 4
    DIR_EXISTS = 5

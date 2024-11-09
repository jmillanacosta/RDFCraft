from server.const.err_enums import ErrCodes


class ServerException(Exception):
    def __init__(self, message: str, code: ErrCodes):
        self.message = message
        self.code = code
        super().__init__(message)


__all__ = ["ServerException"]

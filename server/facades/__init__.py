import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any

from server.exceptions import ErrCodes, ServerException


@dataclass
class FacadeResponse:
    status: int
    message: str
    data: Any | None = None
    err_code: ErrCodes | None = None

    def to_dict(self):
        return {
            "status": self.status,
            "message": self.message,
            "data": self.data,
            "err_code": self.err_code.value
            if self.err_code
            else None,
        }


class BaseFacade(ABC):
    def __init__(self):
        self.logger = logging.getLogger(
            self.__class__.__name__
        )

    @abstractmethod
    def execute(self, *args, **kwargs) -> FacadeResponse:
        pass

    @staticmethod
    def error_wrapper(
        func,
    ):
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                return BaseFacade._error_response(e)

        return wrapper

    @staticmethod
    def _error_response(
        e: Exception,
    ):
        if isinstance(e, ServerException):
            return FacadeResponse(
                message=e.message,
                status=400,
                err_code=e.code,
            )
        return FacadeResponse(
            message=str(e),
            status=500,
            err_code=ErrCodes.UNKNOWN_ERROR,
        )

    @staticmethod
    def _success_response(
        data: Any,
        message: str,
        status: int = 200,
    ) -> FacadeResponse:
        return FacadeResponse(
            message=message,
            status=status,
            data=data,
        )

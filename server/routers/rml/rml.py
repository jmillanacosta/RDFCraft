from typing import Annotated

from fastapi.exceptions import HTTPException
from fastapi.params import Body, Depends
from fastapi.routing import APIRouter
from kink.container import di
from starlette.responses import PlainTextResponse

from server.exceptions import ServerException
from server.service_protocols.rml_mapper_service_protocol import (
    RMLMapperServiceProtocol,
)

router = APIRouter()


RMLMapperDep = Annotated[
    RMLMapperServiceProtocol,
    Depends(lambda: di[RMLMapperServiceProtocol]),
]


@router.post(
    "/run-rml-mapping",
    response_class=PlainTextResponse,
)
async def run_rml_mapping(
    rml: Annotated[
        str,
        Body(
            media_type="text/plain",
        ),
    ],
    rml_mapper_service: RMLMapperDep,
) -> str:
    try:
        return rml_mapper_service.execute_rml_mapping(rml)
    except ServerException as e:
        raise HTTPException(
            status_code=500,
            detail=f"{e.code}: {e.message}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

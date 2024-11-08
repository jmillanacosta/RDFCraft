import os

from pydantic import parse_obj_as

from server.logger import setup_logging
from server import app

os.environ["DD_TRACE_ENABLED"] = os.getenv(
    "DD_TRACE_ENABLED", "false"
)

LOG_JSON_FORMAT = parse_obj_as(
    bool, os.getenv("LOG_JSON_FORMAT", False)
)
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
setup_logging(
    json_logs=LOG_JSON_FORMAT, log_level=LOG_LEVEL
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app, host="0.0.0.0", port=8000, log_config=None
    )

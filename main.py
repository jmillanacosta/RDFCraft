import os
import threading

import webview
from dotenv import load_dotenv
from pydantic import parse_obj_as

from server import app
from server.logger import setup_logging

load_dotenv()

DEBUG = os.getenv("DEBUG")

os.environ["DD_TRACE_ENABLED"] = os.getenv(
    "DD_TRACE_ENABLED", "false"
)

thread = None

LOG_JSON_FORMAT = parse_obj_as(
    bool, os.getenv("LOG_JSON_FORMAT", False)
)
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
setup_logging(
    json_logs=LOG_JSON_FORMAT, log_level=LOG_LEVEL
)


def start_fastapi():
    import uvicorn

    uvicorn.run(
        app, host="0.0.0.0", port=8000, log_config=None
    )


def on_closing():
    global thread
    if thread:
        thread.join(timeout=10)
    os._exit(0)


if __name__ == "__main__":
    if DEBUG:
        start_fastapi()
    else:
        # Run server in separate thread
        thread = threading.Thread(target=start_fastapi)
        thread.start()
        # Create window
        window = webview.create_window(
            "RDFCraft",
            "http://localhost:8000",
            width=800,
            height=600,
            resizable=True,
        )
        window.events.closing += on_closing
        webview.start()
        # Send kill signal to server thread
        thread.join()

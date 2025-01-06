import os
import random
import socket
import threading

import webview
from dotenv import load_dotenv
from kink.container import di
from pydantic import parse_obj_as

from server.logger import setup_logging
from server.server import app

load_dotenv()

DEBUG = os.getenv("DEBUG", False)

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


def get_free_port():
    while True:
        port = random.randint(
            1024, 65535
        )  # Ports below 1024 are reserved
        with socket.socket(
            socket.AF_INET, socket.SOCK_STREAM
        ) as s:
            try:
                s.bind(
                    ("", port)
                )  # Bind to the port on all network interfaces
                s.listen(
                    1
                )  # Start listening to check if the port is available
                return port  # If binding succeeds, the port is free
            except OSError:
                continue  # If binding fails, try another port


port = 8000 if DEBUG else get_free_port()

di["PORT"] = port


def start_fastapi():
    import uvicorn

    uvicorn.run(
        app, host="0.0.0.0", port=port, log_config=None
    )


def on_closing():
    global thread
    if thread:
        thread.join(timeout=0)
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
            f"http://localhost:{port}",
            width=800,
            height=600,
            resizable=True,
        )
        window.events.closing += on_closing
        webview._settings["debug"] = True
        webview.start()

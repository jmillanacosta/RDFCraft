import logging
import platform
from os import getenv
from pathlib import Path
from typing import TYPE_CHECKING

from dotenv import load_dotenv
from kink import di

from server.services.core.sqlite_db_service import (
    DBService,
)

if TYPE_CHECKING:
    from fastapi import FastAPI


async def bootstrap():
    logger = logging.getLogger(__name__)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO
    )
    logger.info("Bootstrapping...")
    load_dotenv()
    logger.info("Loading environment variables")

    _debug = getenv("DEBUG")

    if _debug:
        logger.setLevel(logging.DEBUG)
        di["DEBUG"] = True
        logger.info("Debug mode enabled")

    # Setting up application directory
    str_application_directory = getenv("RDFCRAFT_PATH")
    di["APP_DIR"] = (
        Path(str_application_directory)
        if str_application_directory
        else Path.home() / "./rdfcraft"
    )
    if not di["APP_DIR"].exists():
        di["APP_DIR"].mkdir()
    logger.info(
        f"Application directory set to {di['APP_DIR']}"
    )

    # Detecting system and architecture for later use
    di["SYSTEM"] = platform.system()
    di["ARCH"] = platform.machine()

    logger.info(f"System: {di['SYSTEM']}")
    logger.info(f"Architecture: {di['ARCH']}")

    logger.info("Starting core services...")

    # This is a hack to ensure that the DBService is initialized
    di[DBService].get_engine()

    from server.services.core.config_service import (
        ConfigService,
    )

    di[ConfigService].set("system", di["SYSTEM"])
    di[ConfigService].set("arch", di["ARCH"])
    di[ConfigService].set("app_dir", str(di["APP_DIR"]))

    from server.services.core.workspace_metadata_service import (
        WorkspaceMetadataService,  # noqa
    )

    logger.info("Environment variables loaded")

    logger.info("Bootstrapping complete, creating window")


async def teardown():
    di[DBService].dispose()

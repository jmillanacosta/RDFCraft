import logging
import platform
from os import getenv
from pathlib import Path

from dotenv import load_dotenv
from kink import di

from server.services.config_service import ConfigService

from server.services.db_service import (  # noqa # pylint: disable=unused-import # isort:skip
    DBService,
)


async def bootstrap():
    logger = logging.getLogger(__name__)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO
    )
    logger.info("Bootstrapping...")
    load_dotenv()
    logger.info("Loading environment variables")

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
    di[ConfigService].set("system", di["SYSTEM"])
    di[ConfigService].set("arch", di["ARCH"])
    di[ConfigService].set("app_dir", str(di["APP_DIR"]))
    logger.info("Environment variables loaded")


async def teardown():
    di[DBService].dispose()

"""
This file is used to bootstrap the application. It is called from the main
"""

from fastapi import logger
from kink import di
from pathlib import Path
from dotenv import load_dotenv
from os import getenv
from beanie import init_beanie, Document
from motor.motor_asyncio import AsyncIOMotorClient


logging_config = {
    "version": 1,
    "formatters": {
        "simple": {
            "format": (
                "%(asctime)s - %(filename)s - %(levelname)s - %(message)s"
            )
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "INFO",
            "formatter": "simple",
            "stream": "ext://sys.stdout",
        },
        "file": {
            "class": "logging.FileHandler",
            "level": "INFO",
            "formatter": "simple",
            "filename": "app.log",
            "mode": "a",
        },
    },
    "root": {
        "level": "DEBUG",
        "handlers": ["console", "file"],
    },
}


async def bootstrap():
    load_dotenv()
    # Either assign the env variables to global variables or use some kind of DI
    # di["temp_dir"] = Path(os.getenv("TEMP_DIR") or "/app_tmp")

    di["DEBUG"] = bool(getenv("DEBUG")) or False

    logging_config["handlers"]["console"]["level"] = (
        getenv("LOG_LEVEL") or "INFO"
    )
    logging_config["handlers"]["file"]["level"] = (
        getenv("LOG_LEVEL") or "INFO"
    )
    logging_config["root"]["level"] = (
        getenv("LOG_LEVEL") or "INFO"
    )

    di["mongodb_host"] = (
        getenv("MONGODB_HOST") or "localhost"
    )

    di["default_mongodb_database"] = (
        getenv("DEFAULT_MONGODB_DATABASE") or "mapping_db"
    )
    di["mongodb_port"] = int(
        getenv("MONGODB_PORT") or 27017
    )
    di["mongodb_user"] = getenv("MONGODB_USER") or "root"
    di["mongodb_password"] = (
        getenv("MONGODB_PASSWORD") or "root"
    )

    di[AsyncIOMotorClient] = AsyncIOMotorClient(
        f"mongodb://{di['mongodb_user']}:{di['mongodb_password']}@{di['mongodb_host']}:{di['mongodb_port']}/{di['default_mongodb_database']}"
    )

    await init_beanie(
        di[AsyncIOMotorClient].get_default_database(),
    )

    di["jwt_secret"] = getenv("JWT_SECRET") or "secret"
    di["temp_storage"] = Path(
        getenv("TEMP_STORAGE") or "./temp_storage"
    )
    di["file_storage"] = (
        getenv("FILE_STORAGE") or "./file_storage"
    )

    logger.logger.info("Bootstrap done")

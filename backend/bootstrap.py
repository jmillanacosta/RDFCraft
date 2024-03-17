"""
This file is used to bootstrap the application. It is called from the main
"""

import logging
import logging.config
from kink import di
from pathlib import Path
from dotenv import load_dotenv
from os import getenv
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from models import all_documents


async def bootstrap():
    load_dotenv()
    # Either assign the env variables to global variables or use some kind of DI
    # di["temp_dir"] = Path(os.getenv("TEMP_DIR") or "/app_tmp")

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
        f"mongodb://{di['mongodb_user']}:{di['mongodb_password']}@{di['mongodb_host']}:{di['mongodb_port']}/{di['default_mongodb_database']}?authSource=admin"
    )

    await init_beanie(
        di[AsyncIOMotorClient].get_default_database(),
        document_models=all_documents,
    )

    di["jwt_secret"] = getenv("JWT_SECRET") or "secret"
    di["jwt_algorithm"] = getenv("JWT_ALGORITHM") or "HS256"
    di["jwt_expiration"] = int(
        getenv("JWT_EXPIRATION") or 3600
    )
    di["temp_storage"] = Path(
        getenv("TEMP_STORAGE") or "./temp_storage"
    )
    di["file_storage"] = Path(
        getenv("FILE_STORAGE") or "./file_storage"
    )
    logging.info("Bootstrap done")

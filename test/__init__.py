from server.services.core.sqlite_db_service import DBService


def create_in_memory_db_service():
    return DBService.from_connection_string("sqlite:///:memory:")

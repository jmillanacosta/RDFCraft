from beanie import Document, Indexed


class UserDocument(Document):
    username: str = Indexed(str, unique=True)
    password: str
    roles: list[str]


__all__ = ["UserDocument"]

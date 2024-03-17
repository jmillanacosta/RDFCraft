from beanie import Document, Indexed
from helpers.pydantic_uri import PydanticUriRef


class PrefixDocument(Document):
    prefix: str = Indexed(str)
    uri: PydanticUriRef = Indexed(PydanticUriRef)


__all__ = ["PrefixDocument"]

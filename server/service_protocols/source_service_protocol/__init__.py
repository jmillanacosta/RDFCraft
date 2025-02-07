from abc import ABC, abstractmethod

from server.models.source import Source, SourceType


class SourceServiceProtocol(ABC):
    @abstractmethod
    def get_source(self, source_id: str) -> Source:
        """
        Get a source by ID

        Args:
            source_id (str): ID of the source

        Returns:
            Source: Source
        """
        pass

    @abstractmethod
    def download_source(self, source_id: str) -> bytes:
        """
        Download a source

        Args:
            source_id (str): ID of the source

        Returns:
            bytes: Content of the source
        """

    @abstractmethod
    def create_source(
        self,
        type: SourceType,
        content: bytes,
        extra: dict = {},
    ) -> str:
        """
        Create a new source

        Args:
            type (SourceType): Type of the source
            content (bytes): Content of the source, depending on the type this can be a file or connection args

        Returns:
            str: ID of the source
        """
        pass

    @abstractmethod
    def update_source(self, source_id: str, source: Source) -> None:
        """
        Update a source

        Args:
            source_id (str): ID of the source
            source (Source): Source

        Returns:
            None
        """
        pass

    @abstractmethod
    def delete_source(self, source_id: str) -> None:
        """
        Delete a source

        Args:
            source_id (str): ID of the source

        Returns:
            None
        """
        pass

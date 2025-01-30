import logging

from rdflib import Graph


class RDFLoader:
    PARSER_LIST = [
        "json-ld",
        "hext",
        "n3",
        "nquads",
        "patch",
        "nt",
        "trix",
        "turtle",
        "xml",
    ]

    logger = logging.getLogger(__name__)

    @staticmethod
    def load_rdf_bytes(
        rdf_bytes: bytes,
    ) -> Graph:
        """
        Load RDF bytes into a graph

        Parameters:
            rdf_bytes (bytes): RDF bytes

        Returns:
            Graph: RDF graph
        """
        graph = Graph()
        try:
            graph.parse(data=rdf_bytes, format="ttl")
            return graph
        except Exception as e:
            RDFLoader.logger.warning(
                f"Failed to parse RDF bytes: {e}, trying other parsers"
            )

        for parser in RDFLoader.PARSER_LIST:
            try:
                graph.parse(data=rdf_bytes, format=parser)
                return graph
            except Exception as e:
                RDFLoader.logger.warning(
                    f"Failed to parse RDF bytes with parser {parser}: {e}"
                )

        raise ValueError("Failed to parse RDF bytes with any parser")

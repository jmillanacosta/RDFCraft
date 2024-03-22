import logging
from pathlib import Path

from beanie import PydanticObjectId
from rdflib import Graph

from helpers.pydantic_uri import PydanticUriRef
from models.ontology_document import (
    OntologyClassDocument,
    OntologyIndividualModel,
    OntologyPropertyDocument,
    PropertyType,
)


class OntologyIndexer:
    def __init__(
        self,
        rdf_path: Path,
        ontology_id: str,
    ):
        self.logger = logging.getLogger(__name__)
        self.rdf_path = rdf_path
        self.ontology_id = ontology_id
        self.g = Graph()
        self.g.parse(str(rdf_path))

    GET_ALL_CLASSES = """
        SELECT DISTINCT ?class ?label ?deprecated ?definition
        WHERE {
            VALUES ?type { owl:Class rdfs:Class } .
            VALUES ?definition_predicate { rdfs:comment skos:definition } .
            ?class a ?type .
            ?class rdfs:label ?label .
            OPTIONAL { ?class ?definition_predicate ?definition } .
            OPTIONAL { ?class owl:deprecated ?deprecated } .
        }
    """

    GET_ALL_DATA_PROPERTIES = """
        SELECT DISTINCT ?prop ?label ?domain ?range ?deprecated ?definition
        WHERE {
            VALUES ?type { owl:DatatypeProperty rdf:Property } .
            VALUES ?definition_predicate { rdfs:comment skos:definition } .
            ?prop a ?type .
            ?prop rdfs:label ?label .
            ?prop rdfs:domain/(owl:unionOf/rdf:rest*/rdf:first)* ?domain .
            ?prop rdfs:range/(owl:unionOf/rdf:rest*/rdf:first)* ?range .
            OPTIONAL { ?prop owl:deprecated ?deprecated } .
            OPTIONAL { ?prop ?definition_predicate ?definition } .
            FILTER (!isBlank(?domain)) .
            FILTER (!isBlank(?range)) .
        }
    """

    GET_ALL_OBJECT_PROPERTIES = """
        SELECT DISTINCT ?prop ?label ?domain ?range ?deprecated ?definition
        WHERE {
            VALUES ?type { owl:ObjectProperty rdf:Property } .
            VALUES ?definition_predicate { rdfs:comment skos:definition } .
            ?prop a ?type .
            ?prop rdfs:label ?label .
            ?prop rdfs:domain/(owl:unionOf/rdf:rest*/rdf:first)* ?domain .
            ?prop rdfs:range/(owl:unionOf/rdf:rest*/rdf:first)* ?range .
            OPTIONAL { ?prop owl:deprecated ?deprecated } .
            OPTIONAL { ?prop ?definition_predicate ?definition } .
            FILTER (!isBlank(?domain)) .
            FILTER (!isBlank(?range)) .
         
        }
    """

    GET_ALL_INDIVIDUALS = """
        SELECT DISTINCT ?individual ?label ?deprecated ?definition
        WHERE {
            VALUES ?type { owl:NamedIndividual } .
            VALUES ?definition_predicate { rdfs:comment skos:definition } .
            ?individual a ?type .
            ?individual rdfs:label ?label .
            OPTIONAL { ?individual owl:deprecated ?deprecated } .
            OPTIONAL { ?individual ?definition_predicate ?definition } .
            FILTER(?deprecated = false || !bound(?deprecated))
        }
    """

    def extract_classes(self):
        self.logger.info("Extracting classes from ontology")
        result = self.g.query(self.GET_ALL_CLASSES)
        class_list: list[OntologyClassDocument] = [
            OntologyClassDocument(
                full_uri=PydanticUriRef(full_uri),
                ontology_id=PydanticObjectId(
                    self.ontology_id
                ),
                label=str(label),
                description=(
                    str(definition) if definition else ""
                ),
                is_deprecated=(
                    bool(deprecated)
                    if deprecated
                    else False
                ),
            )
            for full_uri, label, deprecated, definition in result  # type: ignore
        ]

        self.logger.info(
            f"Extracted {len(class_list)} classes from ontology"
        )

        return class_list

    def extract_data_properties(self):
        self.logger.info(
            "Extracting data properties from ontology"
        )
        result = self.g.query(self.GET_ALL_DATA_PROPERTIES)
        data_property_list = [
            {
                "full_uri": str(prop),
                "ontology_id": PydanticObjectId(
                    self.ontology_id
                ),
                "label": str(label),
                "description": (
                    str(definition) if definition else ""
                ),
                "domain": str(domain),
                "range": str(range),
                "is_deprecated": (
                    bool(deprecated)
                    if deprecated
                    else False
                ),
            }
            for prop, label, domain, range, deprecated, definition in result  # type: ignore
        ]

        # Merge and create OntologyPropertyModel

        final_data_property_dict: dict[str, dict] = {}

        for data_property in data_property_list:
            if (
                data_property["full_uri"]
                in final_data_property_dict
            ):
                final_data_property_dict[
                    data_property["full_uri"]
                ]["property_domain"].add(
                    data_property["domain"]
                )
                final_data_property_dict[
                    data_property["full_uri"]
                ]["property_range"].add(
                    data_property["range"]
                )
            else:
                final_data_property_dict[
                    data_property["full_uri"]
                ] = data_property
                final_data_property_dict[
                    data_property["full_uri"]
                ]["property_domain"] = {
                    data_property["domain"]
                }
                final_data_property_dict[
                    data_property["full_uri"]
                ]["property_range"] = {
                    data_property["range"]
                }

        for (
            data_property
        ) in final_data_property_dict.values():
            data_property["property_domain"] = list(
                data_property["property_domain"]
            )
            data_property["property_range"] = list(
                data_property["property_range"]
            )

        data_property_list = [
            OntologyPropertyDocument(
                **data_property,
                property_type=PropertyType.DATA_PROPERTY,
            )
            for data_property in final_data_property_dict.values()
        ]
        self.logger.info(
            f"Extracted {len(data_property_list)} data properties from ontology"
        )
        return data_property_list

    def extract_object_properties(self):
        self.logger.info(
            "Extracting object properties from ontology"
        )
        result = self.g.query(
            self.GET_ALL_OBJECT_PROPERTIES
        )
        object_property_list = [
            {
                "full_uri": str(prop),
                "ontology_id": PydanticObjectId(
                    self.ontology_id
                ),
                "label": str(label),
                "description": (
                    str(definition) if definition else ""
                ),
                "domain": str(domain),
                "range": str(range),
                "is_deprecated": (
                    bool(deprecated)
                    if deprecated
                    else False
                ),
            }
            for prop, label, domain, range, deprecated, definition in result  # type: ignore
        ]

        # Merge and create OntologyPropertyModel

        final_object_property_dict: dict[str, dict] = {}

        for object_property in object_property_list:
            if (
                object_property["full_uri"]
                in final_object_property_dict
            ):
                final_object_property_dict[
                    object_property["full_uri"]
                ]["property_domain"].add(
                    object_property["domain"]
                )
                final_object_property_dict[
                    object_property["full_uri"]
                ]["property_range"].add(
                    object_property["range"]
                )
            else:
                final_object_property_dict[
                    object_property["full_uri"]
                ] = object_property
                final_object_property_dict[
                    object_property["full_uri"]
                ]["property_domain"] = {
                    object_property["domain"]
                }
                final_object_property_dict[
                    object_property["full_uri"]
                ]["property_range"] = {
                    object_property["range"]
                }

        object_property_list = [
            OntologyPropertyDocument(
                **object_property,
                property_type=PropertyType.OBJECT_PROPERTY,
            )
            for object_property in final_object_property_dict.values()
        ]

        self.logger.info(
            f"Extracted {len(object_property_list)} object properties from ontology"
        )

        return object_property_list

    def extract_individuals(
        self,
    ) -> list[OntologyIndividualModel]:
        self.logger.info(
            "Extracting individuals from ontology"
        )
        result = self.g.query(self.GET_ALL_INDIVIDUALS)
        individual_list = [
            OntologyIndividualModel(
                full_uri=PydanticUriRef(individual),
                ontology_id=PydanticObjectId(
                    self.ontology_id
                ),
                label=str(label),
                description=(
                    str(definition) if definition else ""
                ),
                is_deprecated=(
                    bool(deprecated)
                    if deprecated
                    else False
                ),
            )
            for individual, label, deprecated, definition in result  # type: ignore
        ]
        _dedup_dict = {
            individual.full_uri: individual
            for individual in individual_list
        }
        individual_list = list(_dedup_dict.values())

        self.logger.info(
            f"Extracted {len(individual_list)} individuals from ontology"
        )
        return individual_list

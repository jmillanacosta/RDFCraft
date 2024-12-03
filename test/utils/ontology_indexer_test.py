import unittest
from pathlib import Path

from rdflib import Graph

from server.models.ontology import (
    Class,
)
from server.utils.ontology_indexer import OntologyIndexer
from server.utils.rdf_loader import RDFLoader

"""
@prefix : <http://example.org/ontology#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .


:LivingThing rdf:type owl:Class .
:InanimateObject rdf:type owl:Class .
:Person rdf:type owl:Class ;
    rdfs:subClassOf :LivingThing .
:Animal rdf:type owl:Class ;
    rdfs:subClassOf :LivingThing .
:Car rdf:type owl:Class ;
    rdfs:subClassOf :InanimateObject .
:House rdf:type owl:Class ;
    rdfs:subClassOf :InanimateObject .


:hasName rdf:type owl:DatatypeProperty ;
    rdfs:domain :LivingThing ;
    rdfs:range xsd:string .
:hasAge rdf:type owl:DatatypeProperty ;
    rdfs:domain :LivingThing, :InanimateObject ;
    rdfs:range xsd:integer .
:hasColor rdf:type owl:DatatypeProperty ;
    rdfs:domain :InanimateObject ;
    rdfs:range xsd:string .

# Write owl individuals

:John rdf:type :Person, owl:NamedIndividual ;
    :hasName "John" ;
    :hasAge 30 .

:Rover rdf:type :Animal, owl:NamedIndividual ;
    :hasName "Rover" ;
    :hasAge 5 .

:Toyota rdf:type :Car, owl:NamedIndividual ;
    :hasName "Toyota" ;
    :hasAge 3 ;
    :hasColor "Red" .

:WhiteHouse rdf:type :House, owl:NamedIndividual ;
    :hasName "House1" ;
    :hasAge 10 ;
    :hasColor "White" .


"""


class TestOntologyIndexer(unittest.TestCase):
    def setUp(self):
        self.indexer = OntologyIndexer()
        self.graph = Graph()
        self.bytes = Path(
            "test/test_assets/test_ontology.ttl"
        ).read_bytes()
        self.graph = RDFLoader.load_rdf_bytes(self.bytes)
        self.ontology_uri = "http://example.org/ontology"

    def tearDown(self) -> None:
        self.graph.close()
        return super().tearDown()

    def test_get_classes(self):
        classes: list[Class] = self.indexer.get_classes(
            self.ontology_uri, self.graph
        )
        self.assertEqual(len(classes), 6)

        expected_full_uris = set(
            [
                "http://example.org/ontology#LivingThing",
                "http://example.org/ontology#InanimateObject",
                "http://example.org/ontology#Person",
                "http://example.org/ontology#Animal",
                "http://example.org/ontology#Car",
                "http://example.org/ontology#House",
            ]
        )

        found_full_uris = set(
            [str(cls.full_uri) for cls in classes]
        )

        self.assertEqual(
            expected_full_uris, found_full_uris
        )

    def test_get_properties(self):
        properties = self.indexer.get_properties(
            self.ontology_uri, self.graph
        )
        self.assertEqual(len(properties), 3)

        expected_full_uris = set(
            [
                "http://example.org/ontology#hasName",
                "http://example.org/ontology#hasAge",
                "http://example.org/ontology#hasColor",
            ]
        )

        found_full_uris = set(
            [str(prop.full_uri) for prop in properties]
        )

        self.assertEqual(
            expected_full_uris, found_full_uris
        )

        self.assertEqual(
            str(properties[0].domain[0]),
            "http://example.org/ontology#LivingThing",
        )

    def test_get_individuals(self):
        individuals = self.indexer.get_individuals(
            self.ontology_uri, self.graph
        )
        self.assertEqual(len(individuals), 4)

        expected_full_uris = set(
            [
                "http://example.org/ontology#John",
                "http://example.org/ontology#Rover",
                "http://example.org/ontology#Toyota",
                "http://example.org/ontology#WhiteHouse",
            ]
        )

        found_full_uris = set(
            [str(ind.full_uri) for ind in individuals]
        )

        self.assertEqual(
            expected_full_uris, found_full_uris
        )


if __name__ == "__main__":
    unittest.main()

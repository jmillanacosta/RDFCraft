from rdflib import SH, Graph, Namespace, URIRef
from rdflib.namespace import RDF

g = Graph()
g.parse("Dataset.ttl", format="turtle")  # Change format if needed


query = """
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX dash: <http://datashapes.org/dash#>

SELECT DISTINCT ?class ?property ?propPredicate ?propObject
WHERE {
    ?shape sh:targetClass ?class .  # Find all node shapes with a target class
    ?shape sh:property ?property .  # Get properties associated with the shape
    ?property ?propPredicate ?propObject .  # Retrieve details of the property

    # Exclude DASH_EDITOR and DASH_VIEWER predicates
    FILTER (?propPredicate != dash:editor && ?propPredicate != dash:viewer)
}

"""
results = g.query(query)
for result in results:
    print(result)

# map the triples to the classes for the data model

# classes are Class class

# for properties infer class from node node kind property

# default node kind should be literal
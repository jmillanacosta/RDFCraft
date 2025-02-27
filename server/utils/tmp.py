from rdflib import SH, Graph, Namespace, URIRef
from rdflib.namespace import RDF

g = Graph()
g.parse("Dataset.ttl", format="turtle")  # Change format if needed

# Define SHACL namespace
SH = Namespace("http://www.w3.org/ns/shacl#")

# Query for all classes that are the target of a shape
query = """
SELECT DISTINCT ?class WHERE {
    ?shape a sh:NodeShape ;
           sh:targetClass ?class .
}
"""

# Execute the query
results = g.query(query, initNs={"sh": SH})

# Print the extracted classes
for row in results:
    print(row)
    # print(row.class)


print("---")

targetClass = URIRef(SH.targetClass)
DASH_EDITOR = URIRef('http://datashapes.org/dash#editor')
DASH_VIEWER = URIRef('http://datashapes.org/dash#viewer')

for s, p, o in g.triples((None, targetClass, None)):
    # print(f"{s}, {p}, {o}")
    for s, p, o in g.triples((s, SH.property, None)):
        for s, p, o in g.triples((o, None, None)):
            if (p == DASH_EDITOR or p == DASH_VIEWER):
                continue
            print(f"{s}, {p}, {o}")
    print("---")
print("*****")


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
# default node kind should be literal
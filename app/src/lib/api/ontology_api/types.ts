interface Literal {
  /**
   * A literal is a value that is not a URI, but a string, integer, etc.
   */
  value: string;
  datatype?: string;
  language?: string;
}

enum NamedNodeType {
  CLASS = 'class',
  INDIVIDUAL = 'individual',
  PROPERTY = 'property',
}

enum PropertyType {
  OBJECT = 'object',
  DATATYPE = 'datatype',
  ANNOTATION = 'annotation',
}

interface NamedNode {
  /**
   * A named node is a node that has a URI.
   */
  belongsTo: string;
  type: NamedNodeType;
  fullUri: string;
  label: Literal[];
  description: Literal[];
  isDeprecated?: boolean;
}

interface Individual extends NamedNode {
  /**
   * An individual is a named node that is an instance of a class.
   */
  type: NamedNodeType.INDIVIDUAL;
}

interface OntologyClass extends NamedNode {
  /**
   * A class is a named node that is a class.
   */
  superClasses: string[];
  type: NamedNodeType.CLASS;
}

interface Property extends NamedNode {
  /**
   * A property is a named node that is a property.
   */
  propertyType: PropertyType;
  range: string[];
  domain: string[];
  type: NamedNodeType.PROPERTY;
}

interface Ontology {
  /**
   * An ontology is a collection of named nodes.
   */
  uuid: string;
  fileUuid: string;
  name: string;
  description: string;
  baseUri: string;
  classes: OntologyClass[];
  individuals: Individual[];
  properties: Property[];
}

export type {
  Individual,
  Literal,
  NamedNode,
  NamedNodeType,
  Ontology,
  OntologyClass,
  Property,
  PropertyType,
};

interface Literal {
  /**
   * A literal is a value that is not a URI, but a string, integer, etc.
   */
  value: string;
  datatype?: string;
  language?: string;
}

type NamedNodeType = 'class' | 'individual' | 'property';

type PropertyType = 'object' | 'datatype' | 'annotation' | 'any';

interface NamedNode {
  /**
   * A named node is a node that has a URI.
   */
  belongs_to: string;
  type: NamedNodeType;
  full_uri: string;
  label: Literal[];
  description: Literal[];
  is_deprecated?: boolean;
}

interface Individual extends NamedNode {
  /**
   * An individual is a named node that is an instance of a class.
   */
  type: 'individual';
}

interface OntologyClass extends NamedNode {
  /**
   * A class is a named node that is a class.
   */
  super_classes: string[];
  type: 'class';
}

interface Property extends NamedNode {
  /**
   * A property is a named node that is a property.
   */
  property_type: PropertyType;
  range: string[];
  domain: string[];
  type: 'property';
}

interface Ontology {
  /**
   * An ontology is a collection of named nodes.
   */
  uuid: string;
  file_uuid: string;
  name: string;
  description: string;
  base_uri: string;
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

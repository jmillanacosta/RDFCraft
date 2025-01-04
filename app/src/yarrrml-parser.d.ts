declare module '@rmlio/yarrrml-parser/lib/rml-generator' {
  import { NamedNode, Quad } from 'n3';
  import { AbstractGenerator } from './abstract-generator';

  interface Yarrrml {
    base?: string;
    sources?: Record<string, unknown>;
    targets?: Record<string, unknown>;
    mappings?: Record<string, unknown>;
  }

  interface Source {
    type?: string;
    access?: string;
    delimiter?: string;
    iterator?: string;
    query?: string;
    queryFormulation?: string;
    credentials?: {
      username?: string;
      password?: string;
    };
    security?: Array<unknown>;
  }

  interface Target {
    serialization?: string;
    compression?: string;
    type?: string;
    access?: string;
    ldes?: {
      id: string;
      generateImmutableIRI?: boolean;
      shape?: string;
      timestampPath?: string;
      versionOfPath?: string;
    };
  }

  class AbstractGenerator {
    constructor(options?: unknown);

    convert(
      yarrrml: string | Array<{ yarrrml: string; file?: string }>,
    ): Quad[];

    convertExpandedJSON(yarrrml: Yarrrml): void;

    private _combineExpandedJSONs(expandedJSONs: Yarrrml[]): Yarrrml;

    private _addSourceValuesToTarget(
      sourceObj: Record<string, unknown>,
      targetObj: Record<string, unknown>,
      messageValue: string,
    ): void;

    generateMapping(
      tmSubject: NamedNode,
      mapping: unknown,
      mappingName: string,
      sourceSubject: NamedNode | undefined,
      targetsIRIMap: Record<string, NamedNode>,
    ): void;

    generateNormalObjectMap(omSubject: NamedNode, o: unknown): void;

    generateAllReferencingObjectMap(): void;

    generateReferencingObjectMap(pomSubject: NamedNode, o: unknown): void;

    generateCondition(condition: unknown, omSubject: NamedNode): void;

    saveReferencingObjectMapDetails(
      mappingName: string,
      pom: NamedNode,
      o: unknown,
    ): void;

    generateFunctionTermMap(
      omSubject: NamedNode,
      o: unknown,
      sourceSubject: NamedNode,
      termType: string,
    ): void;

    generateGraphMap(
      subject: NamedNode,
      graph: unknown,
      sourceSubject: NamedNode,
    ): void;

    generateFnSource(fnSubject: NamedNode, sourceSubject: NamedNode): void;

    private _generateDatasetDescription(authors: Array<unknown>): void;

    static parseTemplate(t: string): string;

    static escapeTemplate(t: string): string;

    static countReference(t: string): number;

    static hasConstantPart(t: string): boolean;

    static getFirstReference(t: string): string;

    private _replaceExternalReferences(str: string): string;

    getUniqueID(prefix?: string): string;

    static expandPrefix(str: string): string;

    addMappingIRI(mappingName: string, iri: NamedNode): void;

    getPrefixes(): Record<string, string>;

    getBaseIRI(): string;

    getAppropriatePredicateAndObjectForValue(
      value: string,
      isIRI?: boolean,
    ): { predicate: NamedNode; object: NamedNode | Literal };

    convertEqualToIDLabEqual(fn: unknown): void;

    getLogger(): unknown;

    removeUnusedDatatypes(o: unknown): void;

    processDatatypeAndLanguageOfObject(o: unknown, omSubject: NamedNode): void;
  }

  class RMLGenerator extends AbstractGenerator {
    constructor(options?: unknown);

    convertExpandedJSON(yarrrml: Yarrrml): Quad[];

    private _generateTargetId(target: unknown): string;

    generateMapping(
      tmSubject: NamedNode,
      mapping: unknown,
      mappingName: string,
      sourceSubject: NamedNode | undefined,
      targetsIRIMap: Record<string, NamedNode>,
    ): void;

    generateSource(
      source: Source,
      tmSubject?: NamedNode,
      sourceName?: string,
    ): NamedNode;

    generateTarget(target: Target, targetName?: string): NamedNode;

    private _generateDatabaseDescription(
      subject: NamedNode,
      source: Source,
    ): void;

    generateFnSource(fnSubject: NamedNode, sourceSubject: NamedNode): void;

    generateLanguageTerms(objectMap: NamedNode, value: unknown): NamedNode;

    generateCondition(condition: unknown, omSubject: NamedNode): void;

    getReferenceOnlyPredicate(): NamedNode;

    private _parametersContainsFunction(parameters: unknown[]): boolean;

    private _parametersContainsConstantValues(parameters: unknown[]): boolean;

    private _parametersContainsTemplates(parameters: unknown[]): boolean;
  }

  export = RMLGenerator;
}

import { EntityContainer } from "./entity-container";

export interface Entity {
    '@id': string;
    '@type': string;
    'http://www.w3.org/2000/01/rdf-schema#label': string;
    datatypeProperties: { [key: string]: any };
    objectProperties: EntityContainer[];
    [key: string]: any;
}
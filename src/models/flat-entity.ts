import { EntityContainer } from "./entity-container";

export interface FlatEntity {
    '@id': string;
    '@type': string;
    'http://www.w3.org/2000/01/rdf-schema#label': string;
    [key: string]: any;
}
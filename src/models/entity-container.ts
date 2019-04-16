import { Entity } from "./entity";

export interface EntityContainer {
    [predicateURI: string]: Entity;
}
import { Entity } from "./entity";

export interface EntityListWrapper {
    [key: string]: Entity;
}
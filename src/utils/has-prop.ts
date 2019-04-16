import { Entity } from "../models/entity";
import { EntityContainer } from "../models/entity-container";

export function hasProp(base: Entity|EntityContainer, propName: string[]): any {
    const name = propName[0];
    if (!name) {
        return base;
    } else if (base && !base[name]) {
        return null;
    }
    return hasProp(base[name], propName.slice(1));
};

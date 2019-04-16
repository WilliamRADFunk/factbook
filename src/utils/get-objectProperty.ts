import { EntityContainer } from '../models/entity-container';
import { hasProp } from './has-prop';

export function getRelation(objectPropertyList: EntityContainer[], propName: string): any {
    const propNameChain: string[] = Array.isArray(propName) ? propName : [propName];
    const rel = objectPropertyList.find(objectProperty => !!hasProp(objectProperty, propNameChain));
    return rel && rel[propNameChain[0]] || null;
};

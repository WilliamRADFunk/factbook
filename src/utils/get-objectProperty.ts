import { hasProp } from './has-prop';
import { EntityContainer } from '../models/entity-container';

export function getRelation(objectPropertyList: EntityContainer[], propName: string): any {
    let propNameChain: string[] = Array.isArray(propName) ? propName : [propName];
    let rel = objectPropertyList.find(objectProperty => { return !!hasProp(objectProperty, propNameChain); });
    return rel && rel[propNameChain[0]] || null;
};

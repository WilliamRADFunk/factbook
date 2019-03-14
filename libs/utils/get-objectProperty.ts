import { hasProp } from './has-prop';

export function getRelation(objectPropertyList, propName) {
    let propNameChain = Array.isArray(propName) ? propName : [propName];
    let rel = objectPropertyList.find(objectProperty => { return !!hasProp(objectProperty, propNameChain); });
    return rel && rel[propNameChain[0]];
};

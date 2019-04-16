"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var has_prop_1 = require("./has-prop");
function getRelation(objectPropertyList, propName) {
    var propNameChain = Array.isArray(propName) ? propName : [propName];
    var rel = objectPropertyList.find(function (objectProperty) { return !!has_prop_1.hasProp(objectProperty, propNameChain); });
    return rel && rel[propNameChain[0]] || null;
}
exports.getRelation = getRelation;
;

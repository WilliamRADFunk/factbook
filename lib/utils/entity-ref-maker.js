"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function entityRefMaker(predicateURI, entityContainer) {
    var entity = entityContainer[predicateURI];
    var objectProp = {};
    objectProp[predicateURI] = {
        '@id': entity['@id'],
        '@type': entity['@type'],
        datatypeProperties: {},
        'http://www.w3.org/2000/01/rdf-schema#label': entity['http://www.w3.org/2000/01/rdf-schema#label'],
        objectProperties: []
    };
    return objectProp;
}
exports.entityRefMaker = entityRefMaker;
;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function entityMaker(predicateURI, typeURI, instId, label) {
    var objectProp = {};
    objectProp[predicateURI] = {
        '@id': instId,
        '@type': typeURI,
        datatypeProperties: {},
        'http://www.w3.org/2000/01/rdf-schema#label': '',
        objectProperties: []
    };
    objectProp[predicateURI]['http://www.w3.org/2000/01/rdf-schema#label'] = label;
    return objectProp;
}
exports.entityMaker = entityMaker;
;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fj = require("formatter-json");
var fs = require("graceful-fs");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
function saveFile(fileName, storeName, context) {
    // Normal JSON file.
    var file = fj(JSON.stringify(globalStore_1.store[storeName]));
    file = file.replace(/\\n/g, ' ');
    fs.writeFileSync("dist/json/" + fileName + ".json", file);
    // JSON-LD file construction.
    var jsonLD = [];
    // const jsonLD = {
    // 	'@context': context,
    // 	'@graph': []
    // };
    Object.keys(globalStore_1.store[storeName]).forEach(function (key1) {
        // Grab the basic @id, @type, and rdfs label
        var mainObj = {
            '@id': globalStore_1.store[storeName][key1]['@id'],
            '@type': globalStore_1.store[storeName][key1]['@type'],
            'http://www.w3.org/2000/01/rdf-schema#label': globalStore_1.store[storeName][key1][constants_1.consts.RDFS.label]
        };
        // Pull datatype properties out of their singleton object and make them direct props.
        var dataProps = globalStore_1.store[storeName][key1].datatypeProperties;
        Object.keys(dataProps).forEach(function (key2) {
            mainObj[key2] = dataProps[key2];
        });
        // Pull out object properties, and make them direct properties but with array groups for multiples.
        var objectProps = globalStore_1.store[storeName][key1].objectProperties;
        objectProps.forEach(function (objP) {
            // Should be one key per object
            var key = Object.keys(objP)[0];
            if (mainObj[key]) {
                if (Array.isArray(mainObj[key])) {
                    mainObj[key].push(objP[key]);
                }
                else {
                    mainObj[key] = [mainObj[key], objP[key]];
                }
            }
            else {
                mainObj[key] = objP[key];
            }
        });
        // Add it to the graph that belongs to this entity type.
        // jsonLD['@graph'].push(mainObj);
        jsonLD.push(mainObj);
    });
    var fileLD = fj(JSON.stringify(jsonLD));
    fileLD = fileLD.replace(/\\n/g, ' ');
    fs.writeFileSync("dist/jsonld/" + fileName + ".schema.jsonld", fileLD);
}
exports.saveFile = saveFile;
;

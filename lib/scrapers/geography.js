"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
function parseSingleLocation(cheerio, country, countryId) {
    var content = cheerio.find('div.category_data.subfield.text').text().trim();
    globalStore_1.store.countries[countryId].datatypeProperties[constants_1.consts.ONTOLOGY.DT_LOCATION_REF_DESCRIPTION] = content;
    var geoId = constants_1.consts.ONTOLOGY.INST_GEO_LOCATION + getUuid(country);
    var objectProp = {};
    if (globalStore_1.store.locations[geoId]) {
        objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION] = globalStore_1.store.locations[geoId];
    }
    else {
        objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_LOCATION, constants_1.consts.ONTOLOGY.ONT_GEO_LOCATION, geoId, "Geographic Location for " + country);
        globalStore_1.store.locations[geoId] = objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION];
        var datatypeProp = {};
        datatypeProp[constants_1.consts.ONTOLOGY.DT_LOCATION_DESCRIPTION] = content;
        objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION].datatypeProperties = datatypeProp;
    }
    globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_LOCATION, objectProp));
}
function parseMultipleLocations(cheerioElem, country, countryId, scope) {
    cheerioElem(scope).find('p').each(function (index, element) {
        var content = cheerioElem(element).text().trim();
        var strongTag = cheerioElem(element).find('strong').text().trim().slice(0, -1);
        var locations = globalStore_1.store.countries[countryId].objectProperties
            .filter(function (objProp) { return objProp[constants_1.consts.ONTOLOGY.HAS_LOCATION]; })
            .map(function (objProp) { return objProp[constants_1.consts.ONTOLOGY.HAS_LOCATION]; });
        var objectProp = {};
        if (!strongTag) {
            var description = content.substring(0, content.indexOf(strongTag)).trim();
            globalStore_1.store.countries[countryId].datatypeProperties[constants_1.consts.ONTOLOGY.DT_LOCATION_REF_DESCRIPTION] = description;
        }
        else {
            var geoId_1 = constants_1.consts.ONTOLOGY.INST_GEO_LOCATION + getUuid(country) + getUuid(strongTag);
            var geoAttr = locations.find(function (loc) { return loc && loc['@id'] === geoId_1; });
            if (!geoAttr) {
                if (globalStore_1.store.locations[geoId_1]) {
                    objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION] = globalStore_1.store.locations[geoId_1];
                }
                else {
                    objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_LOCATION, constants_1.consts.ONTOLOGY.ONT_GEO_LOCATION, geoId_1, "Geographic Location for " + country + " - " + strongTag);
                    globalStore_1.store.locations[geoId_1] = objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION];
                    var datatypeProp = {};
                    datatypeProp[constants_1.consts.ONTOLOGY.DT_LOCATION_DESCRIPTION] = content;
                    objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION].datatypeProperties = datatypeProp;
                }
                geoAttr = objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION];
                globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_LOCATION, objectProp));
            }
        }
    });
}
function getGeography(cheerioElem, country, countryId) {
    cheerioElem('#field-location').each(function (index, element) {
        var hasMultLocations = cheerioElem(element).find('div.category_data.subfield.text > p');
        // Multiple p tags suggests the nation has multiple locations in different parts of the world.
        // This means distinct description and geographic coordinates. Each must be handled separately.
        if (hasMultLocations.length) {
            parseMultipleLocations(cheerioElem, country, countryId, element);
        }
        else {
            parseSingleLocation(cheerioElem(element), country, countryId);
        }
    });
    cheerioElem('#field-map-references').each(function (index, element) {
        var mapRef = cheerioElem(element).find('div.category_data.subfield.text').text().trim();
        if (mapRef) {
            globalStore_1.store.countries[countryId].datatypeProperties[constants_1.consts.ONTOLOGY.DT_MAP_REFERENCES] = mapRef;
        }
    });
}
exports.getGeography = getGeography;
;

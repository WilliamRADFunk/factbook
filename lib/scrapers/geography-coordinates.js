"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
function parseSingleCoordinates(cheerio, country, countryId) {
    var geoId = constants_1.consts.ONTOLOGY.INST_GEO_LOCATION + getUuid(country);
    var locations = globalStore_1.store.countries[countryId].objectProperties
        .filter(function (objProp) { return objProp[constants_1.consts.ONTOLOGY.HAS_LOCATION]; });
    var foundEntityContainer = locations.find(function (loc) { return loc && loc[constants_1.consts.ONTOLOGY.HAS_LOCATION]['@id'] === geoId; });
    var geoAttr = foundEntityContainer && foundEntityContainer[constants_1.consts.ONTOLOGY.HAS_LOCATION];
    var content = cheerio.find('div.category_data.subfield.text').text().trim();
    var objectProp = {};
    if (!geoAttr) {
        if (globalStore_1.store.locations[geoId]) {
            objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION] = globalStore_1.store.locations[geoId];
        }
        else {
            objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_LOCATION, constants_1.consts.ONTOLOGY.ONT_GEO_LOCATION, geoId, "Geographic Location for " + country);
            globalStore_1.store.locations[geoId] = objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION];
        }
        geoAttr = objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION];
        globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_LOCATION, objectProp));
    }
    else {
        geoAttr = globalStore_1.store.locations[geoId];
    }
    if (content) {
        var coords = content.split(',');
        var latSplit = coords[0].trim().split(' ');
        var lat = (latSplit[latSplit.length - 1].includes('S') ? -1 : 1) * Number(latSplit[0].trim() + '.' + latSplit[1].trim());
        var lngSplit = coords[1].trim().split(' ');
        var lng = (lngSplit[lngSplit.length - 1].includes('W') ? -1 : 1) * Number(lngSplit[0].trim() + '.' + lngSplit[1].trim());
        var datatypeProp = {};
        if (geoAttr.datatypeProperties) {
            geoAttr.datatypeProperties[constants_1.consts.WGS84_POS.LAT] = lat;
            geoAttr.datatypeProperties[constants_1.consts.WGS84_POS.LONG] = lng;
            geoAttr.datatypeProperties[constants_1.consts.WGS84_POS.LAT_LONG] = lat + ", " + lng;
        }
        else {
            datatypeProp[constants_1.consts.WGS84_POS.LAT] = lat;
            datatypeProp[constants_1.consts.WGS84_POS.LONG] = lng;
            datatypeProp[constants_1.consts.WGS84_POS.LAT_LONG] = lat + ", " + lng;
            geoAttr.datatypeProperties = datatypeProp;
        }
    }
}
function parseMultipleCoordinates(cheerioElem, country, countryId, scope) {
    cheerioElem(scope).find('p').each(function (index, element) {
        var content = cheerioElem(element).text().trim().split(':')[1];
        var strongTag = cheerioElem(element).find('strong').text().trim().slice(0, -1);
        var locations = globalStore_1.store.countries[countryId].objectProperties
            .filter(function (objProp) { return objProp[constants_1.consts.ONTOLOGY.HAS_LOCATION]; })
            .map(function (objProp) { return objProp[constants_1.consts.ONTOLOGY.HAS_LOCATION]; });
        var objectProp = {};
        if (strongTag) {
            var geoId_1 = constants_1.consts.ONTOLOGY.INST_GEO_LOCATION + getUuid(country) + getUuid(strongTag);
            var geoAttr = locations.find(function (loc) { return loc && loc['@id'] === geoId_1; });
            if (!geoAttr) {
                if (globalStore_1.store.locations[geoId_1]) {
                    objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION] = globalStore_1.store.locations[geoId_1];
                }
                else {
                    objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_LOCATION, constants_1.consts.ONTOLOGY.ONT_GEO_LOCATION, geoId_1, "Geographic Location for " + country + " - " + strongTag);
                    globalStore_1.store.locations[geoId_1] = objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION];
                }
                geoAttr = objectProp[constants_1.consts.ONTOLOGY.HAS_LOCATION];
                globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_LOCATION, objectProp));
            }
            else {
                geoAttr = globalStore_1.store.locations[geoId_1];
            }
            if (content) {
                var coords = content.split(',');
                var latSplit = coords[0].trim().split(' ');
                var lat = (latSplit[latSplit.length - 1].includes('S') ? -1 : 1) * Number(latSplit[0].trim() + '.' + latSplit[1].trim());
                var lngSplit = coords[1].trim().split(' ');
                var lng = (lngSplit[lngSplit.length - 1].includes('W') ? -1 : 1) * Number(lngSplit[0].trim() + '.' + lngSplit[1].trim());
                var datatypeProp = {};
                if (geoAttr && geoAttr.datatypeProperties) {
                    geoAttr.datatypeProperties[constants_1.consts.WGS84_POS.LAT] = lat;
                    geoAttr.datatypeProperties[constants_1.consts.WGS84_POS.LONG] = lng;
                    geoAttr.datatypeProperties[constants_1.consts.WGS84_POS.LAT_LONG] = lat + ", " + lng;
                }
                else {
                    datatypeProp[constants_1.consts.WGS84_POS.LAT] = lat;
                    datatypeProp[constants_1.consts.WGS84_POS.LONG] = lng;
                    datatypeProp[constants_1.consts.WGS84_POS.LAT_LONG] = lat + ", " + lng;
                    geoAttr.datatypeProperties = datatypeProp;
                }
            }
        }
    });
}
function getGeographyCoordinates(cheerioElem, country, countryId) {
    cheerioElem('#field-geographic-coordinates').each(function (index, element) {
        var hasMultLocations = cheerioElem(element).find('div.category_data.subfield.text > p');
        // Multiple p tags suggests the nation has multiple locations in different parts of the world.
        // This means distinct description and geographic coordinates. Each must be handled separately.
        if (hasMultLocations.length) {
            parseMultipleCoordinates(cheerioElem, country, countryId, element);
        }
        else {
            parseSingleCoordinates(cheerioElem(element), country, countryId);
        }
        return;
    });
}
exports.getGeographyCoordinates = getGeographyCoordinates;
;

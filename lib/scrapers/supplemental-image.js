"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var htmlToText = require("html-to-text");
var getUuid = require("uuid-by-string");
var constants_1 = require("../constants/constants");
var globalStore_1 = require("../constants/globalStore");
var entity_maker_1 = require("../utils/entity-maker");
var entity_ref_maker_1 = require("../utils/entity-ref-maker");
function getSupplementalImages(cheerioElem, country, countryId) {
    var objectProperties = globalStore_1.store.countries[countryId].objectProperties;
    cheerioElem('div.item.photo-all').each(function (index, element) {
        var suppImages = objectProperties.filter(function (rel) { return rel[constants_1.consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG]; });
        var a = cheerioElem(element).find('img').attr('src');
        var b = cheerioElem(element).find('img').attr('alt');
        var c = cheerioElem(element).find(cheerioElem('div.carousel-photo-info .photoInfo .flag_description_text'));
        var imageProps = [];
        c.each(function () { imageProps.push(cheerioElem(element).text().trim()); });
        b = b && htmlToText.fromString(b);
        var imgId;
        var suppImgUrl;
        if (a && a.replace('../', '')) {
            var cleanSrc = a.replace('../', '');
            imgId = constants_1.consts.ONTOLOGY.INST_IMAGE + getUuid(cleanSrc);
            suppImgUrl = constants_1.consts.BASE.URL_BASE + cleanSrc;
        }
        if (suppImgUrl && !suppImages.some(function (img) { return img[constants_1.consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG]['@id'].includes(imgId); })) {
            var objectProp = {};
            if (globalStore_1.store.images[imgId]) {
                objectProp[constants_1.consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG] = globalStore_1.store.images[imgId];
            }
            else {
                objectProp = entity_maker_1.entityMaker(constants_1.consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG, constants_1.consts.ONTOLOGY.ONT_IMAGE, imgId, "Supplemental Image for " + country);
                globalStore_1.store.images[imgId] = objectProp[constants_1.consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG];
            }
            globalStore_1.store.countries[countryId].objectProperties.push(entity_ref_maker_1.entityRefMaker(constants_1.consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG, objectProp));
            var datatypeProp = {};
            datatypeProp[constants_1.consts.ONTOLOGY.DT_LOCATOR_URI] = suppImgUrl;
            datatypeProp[constants_1.consts.ONTOLOGY.DT_CONTENT_DESCRIPTION] = b || null;
            datatypeProp[constants_1.consts.ONTOLOGY.DT_IMAGE_DIMENSIONS] = imageProps[0] || 'N/A';
            datatypeProp[constants_1.consts.ONTOLOGY.DT_IMAGE_SIZE] = imageProps[1] || 'N/A';
            objectProp[constants_1.consts.ONTOLOGY.HAS_SUPPLEMENTAL_IMG].datatypeProperties = datatypeProp;
            var pathSplit = suppImgUrl.split('/');
            var fileName = pathSplit[pathSplit.length - 1].split('?')[0].toLowerCase();
            datatypeProp[constants_1.consts.ONTOLOGY.DT_MIME_TYPE] = fileName.split('.')[1];
            datatypeProp[constants_1.consts.ONTOLOGY.DT_COLLECTION_TIMESTAMP] = (new Date()).toISOString();
            datatypeProp[constants_1.consts.ONTOLOGY.DT_CONTENTS] = fileName;
            var options = {
                dest: "dist/images/" + fileName,
                timeout: constants_1.consts.BASE.DATA_REQUEST_TIMEOUT,
                url: suppImgUrl
            };
            globalStore_1.store.IMAGES_TO_SCRAPE.push({
                fileName: fileName,
                options: options
            });
        }
    });
}
exports.getSupplementalImages = getSupplementalImages;
;

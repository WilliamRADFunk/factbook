const getUuid = require('uuid-by-string');
const htmlToText = require('html-to-text');

const constants = require('../constants/constants');
const getRelation = require('../utils/get-relation');

var getBackground = function(cheerioElem, country, root) {
	cheerioElem('#field-background').each(function() {
        let backgroundAttr = root[country].attributes[constants.ONT_BACKGROUND];
        if (backgroundAttr) { return; }

        var bckGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (bckGrd) {
            root[country].attributes[constants.ONT_BACKGROUND] = bckGrd;
        }
    });
};

var getBorderMapImg = function(cheerioElem, country, root) {
    let relations = root[country].relations;
    cheerioElem('div.mapBox').each(function() {
        let map = getRelation(relations, constants.HAS_BORDER_MAP);
        if (map && map.attributes && map.attributes[constants.ORIGINAL_IMAGE_URL]) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var borderMapUrl;
        if (a && a.replace('../', '')) {
            borderMapUrl = constants.URL_BASE + a.replace('../', '');
        }
        if (borderMapUrl) {
			var attrs = {};
			attrs[constants.ORIGINAL_IMAGE_URL] = borderMapUrl;

			var relation = {};
			relation[constants.HAS_BORDER_MAP] = {
				id: constants.INST_BORDER_MAP + getUuid(country),
				label: 'Map of ' + country + ' and its border nations',
				type: constants.ONT_BORDER_MAP,
				attributes: attrs,
				relations: []
			};

            root[country].relations.push(relation);
        }
        // TODO: scrape physical image from url and store it.
    });
};

var getFlag = function(cheerioElem, country, root) {
    let relations = root[country].relations;
    cheerioElem('div.flagBox').each(function() {
        let flag = getRelation(relations, constants.HAS_FLAG);
        if (flag && flag.attributes && flag.attributes[constants.ORIGINAL_IMAGE_URL]) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var flagImgUrl;
        if (a && a.replace('../', '')) {
            flagImgUrl = constants.URL_BASE + a.replace('../', '');
		}
        if (flagImgUrl) {
			var attrs = {};
			attrs[constants.ORIGINAL_IMAGE_URL] = flagImgUrl;

			var relation = {};
			relation[constants.HAS_FLAG] = {
				id: constants.INST_FLAG + getUuid(country),
				label: country + '\'s national flag',
				type: constants.ONT_FLAG,
				attributes: attrs,
				relations: []
			};

            root[country].relations.push(relation);
		}
		
		
        // TODO: scrape physical image from url and store it.
    });
    cheerioElem('div.modalFlagDesc').each(function() {
		let flag = getRelation(relations, constants.HAS_FLAG);
        if (flag && flag.attributes && flag.attributes.description) { return; }
    
        var a = cheerioElem(this).find('div.photogallery_captiontext').text();
        if (!a) { return; }

        if (flag) {
            flag.attributes[constants.ONT_DESCRIPTION] = a.trim();
        } else {
			var attrs = {};
			attrs[constants.ONT_DESCRIPTION] = a.trim();

			var relation = {};
			relation[constants.HAS_FLAG] = {
				id: constants.INST_FLAG + getUuid(country),
				label: country + '\'s national flag',
				type: constants.ONT_FLAG,
				attributes: attrs,
				relations: []
			};

            root[country].relations.push(relation);
        }
    });
};

var getRegionMapImg = function(cheerioElem, country, root) {
    let relations = root[country].relations;
    cheerioElem('div.locatorBox').each(function() {
        let map = getRelation(relations, constants.HAS_REGION_MAP);
        if (map && map.attributes && map.attributes[constants.ORIGINAL_IMAGE_URL]) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var regionMapImgUrl;
        if (a && a.replace('../', '')) {
            regionMapImgUrl = constants.URL_BASE + a.replace('../', '');
        }
        if (regionMapImgUrl) {
			var attrs = {};
			attrs[constants.ORIGINAL_IMAGE_URL] = regionMapImgUrl;

			var relation = {};
			relation[constants.HAS_REGION_MAP] = {
				id: constants.INST_REGION_MAP + getUuid(country),
				label: 'Map of ' + country + ' and its border nations',
				type: constants.ONT_REGION_MAP,
				attributes: attrs,
				relations: []
			};

            root[country].relations.push(relation);
        }
        // TODO: scrape physical image from url and store it.
    });
};

var getSupllementalImages = function(cheerioElem, country, root) {
    let relations = root[country].relations;
    cheerioElem('div.item.photo-all').each(function() {
        let suppImages = relations.filter(rel => rel[constants.HAS_SUPPLEMENTAL_IMG]);

		var a = cheerioElem(this).find('img').attr('src');
		var b = cheerioElem(this).find('img').attr('alt');
		var c = cheerioElem(this).find(cheerioElem('div.carousel-photo-info .photoInfo .flag_description_text'));
		var imageProps = [];
		c.each(function() { imageProps.push(cheerioElem(this).text().trim()); });
		b = b && htmlToText.fromString(b);
		var suppImgId, suppImgUrl;
        if (a && a.replace('../', '')) {
			var cleanSrc = a.replace('../', '');
			suppImgId = getUuid(cleanSrc);
            suppImgUrl = constants.URL_BASE + cleanSrc;
		}
        if (suppImgUrl && !suppImages.some(img => img[constants.HAS_SUPPLEMENTAL_IMG].id.includes(suppImgId))) {
			var attrs = {};
			attrs[constants.ORIGINAL_IMAGE_URL] = suppImgUrl;
			attrs[constants.IMAGE_DIMENSIONS] = imageProps[0] || 'N/A';
			attrs[constants.IMAGE_SIZE] = imageProps[1] || 'N/A';

			var relation = {};
			relation[constants.HAS_SUPPLEMENTAL_IMG] = {
				id: constants.INST_IMAGE + getUuid(country),
				label: b || null,
				type: constants.ONT_IMAGE,
				attributes: attrs,
				relations: []
			};

            root[country].relations.push(relation);
		}
        // TODO: scrape physical image from url and store it.
    });
};

module.exports = {
	getBackground,
	getBorderMapImg,
	getFlag,
	getRegionMapImg,
	getSupllementalImages
};

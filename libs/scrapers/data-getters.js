const getUuid = require('uuid-by-string');

const constants = require('../constants/constants');
const getRelation = require('../utils/get-relation');

var getBackground = function(cheerioElem, country, root) {
	cheerioElem('#field-background').each(function() {
        let backgroundAttr = root[country].attributes.background;
        if (backgroundAttr) { return; }

        var bckGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (bckGrd) {
            root[country].attributes['background'] = bckGrd;
        }
    });
};

var getBorderMapImg = function(cheerioElem, country, root) {
    let relations = root[country].relations;
    cheerioElem('div.mapBox').each(function() {
        let map = getRelation(relations, 'hasBorderMap');
        if (map && map.attributes && map.attributes.originalImageURL) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var borderMapUrl;
        if (a && a.replace('../', '')) {
            borderMapUrl = constants.URL_BASE + a.replace('../', '');
        }
        if (borderMapUrl) {
            root[country].relations.push({
                hasBorderMap: {
                    id: constants.MAIN_INSTANCE_PATH + 'BorderMap/' + getUuid(country),
					label: 'Map of ' + country + ' and its border nations',
					type: constants.MAIN_ONT_PATH + 'BorderMap',
					attributes: {
						originalImageURL: borderMapUrl
					},
					relations: []
                }
            });
        }
        // TODO: scrape physical image from url and store it.
    });
};

var getFlag = function(cheerioElem, country, root) {
    let relations = root[country].relations;
    cheerioElem('div.flagBox').each(function() {
        let flag = getRelation(relations, 'hasFlag');
        if (flag && flag.attributes && flag.attributes.originalImageURL) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var flagImgUrl;
        if (a && a.replace('../', '')) {
            flagImgUrl = constants.URL_BASE + a.replace('../', '');
		}
        if (flagImgUrl) {
            root[country].relations.push({
                hasFlag: {
                    id: constants.MAIN_INSTANCE_PATH + 'flag/' + getUuid(country),
					label: country + '\'s national flag',
					type: constants.MAIN_ONT_PATH + 'flag',
					attributes: {
						originalImageURL: flagImgUrl
					},
					relations: []
                }
            });
		}
		
		
        // TODO: scrape physical image from url and store it.
    });
    cheerioElem('div.modalFlagDesc').each(function() {
		let flag = getRelation(relations, 'hasFlag');
        if (flag && flag.attributes && flag.attributes.description) { return; }
    
        var a = cheerioElem(this).find('div.photogallery_captiontext').text();
        if (!a) { return; }

        if (flag) {
            flag.attributes.description = a.trim();
        } else {
            root[country].relations.push({
                hasFlag: {
                    id: constants.MAIN_INSTANCE_PATH + 'flag/' + getUuid(country),
					label: country + '\'s national flag',
					type: constants.MAIN_ONT_PATH + 'flag',
					attributes: {
						description: a.trim(),
					},
					relations: []
                }
            });
        }
    });
};

var getRegionMapImg = function(cheerioElem, country, root) {
    let relations = root[country].relations;
    cheerioElem('div.locatorBox').each(function() {
        let map = getRelation(relations, 'hasRegionMap');
        if (map && map.attributes && map.attributes.originalImageURL) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var regionMapImgUrl;
        if (a && a.replace('../', '')) {
            regionMapImgUrl = constants.URL_BASE + a.replace('../', '');
        }
        if (regionMapImgUrl) {
            root[country].relations.push({
                hasRegionMap: {
                    id: constants.MAIN_INSTANCE_PATH + 'regionMap/' + getUuid(country),
					label: 'Map of ' + country + ' and its border nations',
					type: constants.MAIN_ONT_PATH + 'regionMap',
					attributes: {
						originalImageURL: regionMapImgUrl
					},
					relations: []
                }
            });
        }
        // TODO: scrape physical image from url and store it.
    });
};

module.exports = {
	getBackground,
	getBorderMapImg,
	getFlag,
	getRegionMapImg
};

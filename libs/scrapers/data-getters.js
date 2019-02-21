const getUuid = require('uuid-by-string');
const htmlToText = require('html-to-text');

const consts = require('../constants/constants');
const getRelation = require('../utils/get-relation');

var getArea = function(cheerioElem, country, root) {
	cheerioElem('#field-area > div.category_data.subfield.numeric').each(function() {
		let areaSwitch = cheerioElem(this).find('span.subfield-name').text().trim();
		let areaData = cheerioElem(this).find('span.subfield-number').text().trim();
		switch (areaSwitch) {
			case 'total:':
				let totalAreaAttr = root[country].attributes[consts.CUSTOM.ONT_TOTAL_AREA];
				if (totalAreaAttr) { return; }
				root[country].attributes[consts.CUSTOM.ONT_TOTAL_AREA] = areaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'land:':
				let landAreaAttr = root[country].attributes[consts.CUSTOM.ONT_LAND_AREA];
				root[country].attributes[consts.CUSTOM.ONT_LAND_AREA] = areaData.replace(/,|[a-z]/g, '').trim();
				if (landAreaAttr) { return; }
				break;
			case 'water:':
				let waterAreaAttr = root[country].attributes[consts.CUSTOM.ONT_WATER_AREA];
				root[country].attributes[consts.CUSTOM.ONT_WATER_AREA] = areaData.replace(/,|[a-z]/g, '').trim();
				if (waterAreaAttr) { return; }
				break;
		}
    });
	cheerioElem('#field-area > div > span.category_data').each(function() {
        let areaRankAttr = root[country].attributes[consts.CUSTOM.ONT_AREA_RANK];
        if (areaRankAttr) { return; }

		let areaRank = cheerioElem(this).find('a').text().trim();
		if (areaRank) {
			root[country].attributes[consts.CUSTOM.ONT_AREA_RANK] = areaRank;
		}
		
	});
	root[country].attributes[consts.CUSTOM.ONT_AREA_UNIT] = 'sq km';
};

var getAreaComparative = function(cheerioElem, country, root) {
	cheerioElem('#field-area-comparative').each(function() {
        let areaAttr = root[country].attributes[consts.CUSTOM.ONT_AREA_COMPARATIVE];
        if (areaAttr) { return; }

        var areaGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (areaGrd) {
            root[country].attributes[consts.CUSTOM.ONT_AREA_COMPARATIVE] = areaGrd;
        }
    });
};

var getBackground = function(cheerioElem, country, root) {
	cheerioElem('#field-background').each(function() {
        let backgroundAttr = root[country].attributes[consts.CUSTOM.ONT_BACKGROUND];
        if (backgroundAttr) { return; }

        var bckGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (bckGrd) {
            root[country].attributes[consts.CUSTOM.ONT_BACKGROUND] = bckGrd;
        }
    });
};

var getBorderMapImg = function(cheerioElem, country, root) {
    let relations = root[country].relations;
    cheerioElem('div.mapBox').each(function() {
        let map = getRelation(relations, consts.CUSTOM.HAS_BORDER_MAP);
        if (map && map.attributes && map.attributes[consts.CUSTOM.ORIGINAL_IMAGE_URL]) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var borderMapUrl;
        if (a && a.replace('../', '')) {
            borderMapUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
        }
        if (borderMapUrl) {
			var attrs = {};
			attrs[consts.CUSTOM.ORIGINAL_IMAGE_URL] = borderMapUrl;

			var relation = {};
			relation[consts.CUSTOM.HAS_BORDER_MAP] = {
				id: consts.CUSTOM.INST_BORDER_MAP + getUuid(country),
				label: 'Map of ' + country + ' and its border nations',
				type: consts.CUSTOM.ONT_BORDER_MAP,
				attributes: attrs,
				relations: []
			};

            root[country].relations.push(relation);
        }
        // TODO: scrape physical image from url and store it.
    });
};

var getCoastLength = function(cheerioElem, country, root) {
	cheerioElem('#field-coastline').each(function() {
        let coastAttr = root[country].attributes[consts.CUSTOM.ONT_COAST_LENGTH];
        if (coastAttr) { return; }

        var coastGrd = cheerioElem(this).find('div.category_data.subfield.numeric').text().trim()
        if (coastGrd) {
			coastGrdSplit = coastGrd.split('km');
			root[country].attributes[consts.CUSTOM.ONT_COAST_LENGTH] = coastGrdSplit[0].trim();
			root[country].attributes[consts.CUSTOM.ONT_COAST_LENGTH_MODIFIER] = coastGrdSplit.slice(1).join('km').replace(/\\n/g, '').trim() || null;
        }
	});
	root[country].attributes[consts.CUSTOM.ONT_COAST_LENGTH_UNIT] = 'km';
};

var getFlag = function(cheerioElem, country, root) {
    let relations = root[country].relations;
    cheerioElem('div.flagBox').each(function() {
        let flag = getRelation(relations, consts.CUSTOM.HAS_FLAG);
        if (flag && flag.attributes && flag.attributes[consts.CUSTOM.ORIGINAL_IMAGE_URL]) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var flagImgUrl;
        if (a && a.replace('../', '')) {
            flagImgUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
		}
        if (flagImgUrl) {
			var attrs = {};
			attrs[consts.CUSTOM.ORIGINAL_IMAGE_URL] = flagImgUrl;

			var relation = {};
			relation[consts.CUSTOM.HAS_FLAG] = {
				id: consts.CUSTOM.INST_FLAG + getUuid(country),
				label: country + '\'s national flag',
				type: consts.CUSTOM.ONT_FLAG,
				attributes: attrs,
				relations: []
			};

            root[country].relations.push(relation);
		}
		
		
        // TODO: scrape physical image from url and store it.
    });
    cheerioElem('div.modalFlagDesc').each(function() {
		let flag = getRelation(relations, consts.CUSTOM.HAS_FLAG);
        if (flag && flag.attributes && flag.attributes.description) { return; }
    
        var a = cheerioElem(this).find('div.photogallery_captiontext').text();
        if (!a) { return; }

        if (flag) {
            flag.attributes[consts.CUSTOM.ONT_DESCRIPTION] = a.trim();
        } else {
			var attrs = {};
			attrs[consts.CUSTOM.ONT_DESCRIPTION] = a.trim();

			var relation = {};
			relation[consts.CUSTOM.HAS_FLAG] = {
				id: consts.CUSTOM.INST_FLAG + getUuid(country),
				label: country + '\'s national flag',
				type: consts.CUSTOM.ONT_FLAG,
				attributes: attrs,
				relations: []
			};

            root[country].relations.push(relation);
        }
    });
};

var getGeography = function(cheerioElem, country, root) {
	cheerioElem('#field-location').each(function() {
        let locationAttr = root[country].attributes[consts.CUSTOM.ONT_LOCATION_DESCRIPTION];
        if (locationAttr) { return; }

        var locGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (locGrd) {
            root[country].attributes[consts.CUSTOM.ONT_LOCATION_DESCRIPTION] = locGrd;
        }
	});
    let relations = root[country].relations;
	cheerioElem('#field-geographic-coordinates').each(function() {
        let geoAttr = getRelation(relations, consts.CUSTOM.HAS_LOCATION);
        if (geoAttr) { return; }

        var geoGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (geoGrd) {
			let coords = geoGrd.split(',');
			let latSplit = coords[0].trim().split(' ');
			let lat = (latSplit[0].includes('S') ? -1 : 1) * Number(latSplit[0].trim() + '.' + latSplit[1].trim());
			let lngSplit = coords[1].trim().split(' ');
			let lng = (lngSplit[0].includes('W') ? -1 : 1) * Number(lngSplit[0].trim() + '.' + lngSplit[1].trim());
			
			var attrs = {};
			attrs[consts.WGS84_POS.LAT] = lat;
			attrs[consts.WGS84_POS.LONG] = lng;
			attrs[consts.WGS84_POS.LAT_LONG] = `${lat}, ${lng}`;

			var relation = {};
			relation[consts.CUSTOM.HAS_LOCATION] = {
				id: consts.CUSTOM.INST_GEO_LOCATION + getUuid(country),
				label: 'Lat/Long location of ' + country + '.',
				type: consts.CUSTOM.ONT_GEO_LOCATION,
				attributes: attrs,
				relations: []
			};

            root[country].relations.push(relation);
        }
    });
	cheerioElem('#field-map-references').each(function() {
        let mapReferenceAttr = root[country].attributes[consts.CUSTOM.ONT_MAP_REFERENCES];
        if (mapReferenceAttr) { return; }

        var mapRef = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (mapRef) {
            root[country].attributes[consts.CUSTOM.ONT_MAP_REFERENCES] = mapRef;
        }
	});
};

var getRegionMapImg = function(cheerioElem, country, root) {
    let relations = root[country].relations;
    cheerioElem('div.locatorBox').each(function() {
        let map = getRelation(relations, consts.CUSTOM.HAS_REGION_MAP);
        if (map && map.attributes && map.attributes[consts.CUSTOM.ORIGINAL_IMAGE_URL]) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var regionMapImgUrl;
        if (a && a.replace('../', '')) {
            regionMapImgUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
        }
        if (regionMapImgUrl) {
			var attrs = {};
			attrs[consts.CUSTOM.ORIGINAL_IMAGE_URL] = regionMapImgUrl;

			var relation = {};
			relation[consts.CUSTOM.HAS_REGION_MAP] = {
				id: consts.CUSTOM.INST_REGION_MAP + getUuid(country),
				label: 'Map of ' + country + ' and its border nations',
				type: consts.CUSTOM.ONT_REGION_MAP,
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
        let suppImages = relations.filter(rel => rel[consts.CUSTOM.HAS_SUPPLEMENTAL_IMG]);

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
            suppImgUrl = consts.CUSTOM.URL_BASE + cleanSrc;
		}
        if (suppImgUrl && !suppImages.some(img => img[consts.CUSTOM.HAS_SUPPLEMENTAL_IMG].id.includes(suppImgId))) {
			var attrs = {};
			attrs[consts.CUSTOM.ORIGINAL_IMAGE_URL] = suppImgUrl;
			attrs[consts.CUSTOM.IMAGE_DIMENSIONS] = imageProps[0] || 'N/A';
			attrs[consts.CUSTOM.IMAGE_SIZE] = imageProps[1] || 'N/A';

			var relation = {};
			relation[consts.CUSTOM.HAS_SUPPLEMENTAL_IMG] = {
				id: consts.CUSTOM.INST_IMAGE + getUuid(country),
				label: b || null,
				type: consts.CUSTOM.ONT_IMAGE,
				attributes: attrs,
				relations: []
			};

            root[country].relations.push(relation);
		}
        // TODO: scrape physical image from url and store it.
    });
};

module.exports = {
	getArea,
	getAreaComparative,
	getBackground,
	getBorderMapImg,
	getCoastLength,
	getFlag,
	getGeography,
	getRegionMapImg,
	getSupllementalImages
};

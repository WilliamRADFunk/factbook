const getUuid = require('uuid-by-string');
const htmlToText = require('html-to-text');

const consts = require('../constants/constants');
const getRelation = require('../utils/get-objectProperty');

var getArea = function(cheerioElem, country, root) {
    let objectProperties = root[country].objectProperties;
	let map = getRelation(objectProperties, consts.CUSTOM.HAS_DOMAIN_AREA);
	if (!map) {
		var objectProp = {};
		objectProp[consts.CUSTOM.HAS_DOMAIN_AREA] = {
			id: consts.CUSTOM.INST_DOMAIN_AREA + getUuid(country),
			label: 'Areas of land and water contained within ' + country + '\'s borders.',
			type: consts.CUSTOM.ONT_DOMAIN_AREA,
			datatypeProperties: {},
			objectProperties: []
		};

		map = objectProp[consts.CUSTOM.HAS_DOMAIN_AREA];
		root[country].objectProperties.push(objectProp);
	}
	cheerioElem('#field-area > div.category_data.subfield.numeric').each(function() {
		let areaSwitch = cheerioElem(this).find('span.subfield-name').text().trim();
		let areaData = cheerioElem(this).find('span.subfield-number').text().trim();
		switch (areaSwitch) {
			case 'total:':
				map.datatypeProperties[consts.CUSTOM.ONT_TOTAL_AREA] = areaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'land:':
				map.datatypeProperties[consts.CUSTOM.ONT_LAND_AREA] = areaData.replace(/,|[a-z]/g, '').trim();
				break;
			case 'water:':
				map.datatypeProperties[consts.CUSTOM.ONT_WATER_AREA] = areaData.replace(/,|[a-z]/g, '').trim();
				break;
		}
    });
	cheerioElem('#field-area > div > span.category_data').each(function() {
        let areaRankAttr = map.datatypeProperties[consts.CUSTOM.ONT_AREA_RANK];

		let areaRank = cheerioElem(this).find('a').text().trim();
		if (areaRank) {
			map.datatypeProperties[consts.CUSTOM.ONT_AREA_RANK] = areaRank;
		}
		
	});
	map.datatypeProperties[consts.CUSTOM.ONT_UNIT] = 'sq km';
	cheerioElem('#field-area-comparative').each(function() {
        var areaGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (areaGrd) {
            map.datatypeProperties[consts.CUSTOM.ONT_AREA_COMPARATIVE] = areaGrd;
        }
    });
};

var getBackground = function(cheerioElem, country, root) {
	cheerioElem('#field-background').each(function() {
        let backgroundAttr = root[country].datatypeProperties[consts.CUSTOM.BACKGROUND];
        if (backgroundAttr) { return; }

        var bckGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (bckGrd) {
            root[country].datatypeProperties[consts.CUSTOM.BACKGROUND] = bckGrd;
        }
    });
};

var getBorderMapImg = function(cheerioElem, country, root) {
    let objectProperties = root[country].objectProperties;
    cheerioElem('div.locatorBox').each(function() {
        let map = getRelation(objectProperties, consts.CUSTOM.HAS_BORDER_MAP);
        if (map && map.datatypeProperties && map.datatypeProperties[consts.CUSTOM.LOCATION_URI]) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var borderMapUrl;
        if (a && a.replace('../', '')) {
            borderMapUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
        }
        if (borderMapUrl) {
			var datatypeProp = {};
			datatypeProp[consts.CUSTOM.LOCATION_URI] = borderMapUrl;

			var objectProp = {};
			objectProp[consts.CUSTOM.HAS_BORDER_MAP] = {
				id: consts.CUSTOM.INST_BORDER_MAP + getUuid(country),
				label: 'Map of ' + country + ' and its border nations',
				type: consts.CUSTOM.ONT_BORDER_MAP,
				datatypeProperties: datatypeProp,
				objectProperties: []
			};

            root[country].objectProperties.push(objectProp);
        }
        // TODO: scrape physical image from url and store it.
    });
};

var getClimate = function(cheerioElem, country, root) {
	cheerioElem('#field-climate').each(function() {
        let climAttr = root[country].datatypeProperties[consts.CUSTOM.ONT_CLIMATE];
        if (climAttr) { return; }

        var climGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim()
        if (climGrd) {
			root[country].datatypeProperties[consts.CUSTOM.ONT_CLIMATE] = climGrd.replace(/\\n/g, '').trim();
        }
	});
};

var getCoastLength = function(cheerioElem, country, root) {
	cheerioElem('#field-coastline').each(function() {
        let coastAttr = root[country].datatypeProperties[consts.CUSTOM.ONT_COAST_LENGTH];
        if (coastAttr) { return; }

        var coastGrd = cheerioElem(this).find('div.category_data.subfield.numeric').text().trim()
        if (coastGrd) {
			coastGrdSplit = coastGrd.split('km');
			root[country].datatypeProperties[consts.CUSTOM.ONT_COAST_LENGTH] = coastGrdSplit[0].trim();
			root[country].datatypeProperties[consts.CUSTOM.ONT_COAST_LENGTH_MODIFIER] = coastGrdSplit.slice(1).join('km').replace(/\\n/g, '').trim() || null;
        }
	});
	root[country].datatypeProperties[consts.CUSTOM.ONT_UNIT] = 'km';
};

var getFlag = function(cheerioElem, country, root) {
    let objectProperties = root[country].objectProperties;
    cheerioElem('div.flagBox').each(function() {
        let flag = getRelation(objectProperties, consts.CUSTOM.HAS_FLAG);
        if (flag && flag.datatypeProperties && flag.datatypeProperties[consts.CUSTOM.LOCATION_URI]) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var flagImgUrl;
        if (a && a.replace('../', '')) {
            flagImgUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
		}
        if (flagImgUrl) {
			var datatypeProp = {};
			datatypeProp[consts.CUSTOM.LOCATION_URI] = flagImgUrl;

			var objectProp = {};
			objectProp[consts.CUSTOM.HAS_FLAG] = {
				id: consts.CUSTOM.INST_FLAG + getUuid(country),
				label: country + '\'s national flag',
				type: consts.CUSTOM.ONT_FLAG,
				datatypeProperties: datatypeProp,
				objectProperties: []
			};

            root[country].objectProperties.push(objectProp);
		}
		
		
        // TODO: scrape physical image from url and store it.
    });
    cheerioElem('div.modalFlagDesc').each(function() {
		let flag = getRelation(objectProperties, consts.CUSTOM.HAS_FLAG);
    
        var a = cheerioElem(this).find('div.photogallery_captiontext').text().trim();
        if (!a) { return; }

        if (flag) {
			flag.datatypeProperties[consts.CUSTOM.CONTENT_DESCRIPTION] = a.replace(/\\n/g, '').trim();
        } else {
			var datatypeProp = {};
			datatypeProp[consts.CUSTOM.CONTENT_DESCRIPTION] = a.trim();

			objectProp[consts.CUSTOM.HAS_FLAG] = {
				id: consts.CUSTOM.INST_FLAG + getUuid(country),
				label: country + '\'s national flag',
				type: consts.CUSTOM.ONT_FLAG,
				datatypeProperties: datatypeProp,
				objectProperties: []
			};

            root[country].objectProperties.push(objectProp);
        }
    });
};

var getGeography = function(cheerioElem, country, root) {
	cheerioElem('#field-location').each(function() {
        let locationAttr = root[country].datatypeProperties[consts.CUSTOM.LOCATION_DESCRIPTION];
        if (locationAttr) { return; }

        var locGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (locGrd) {
            root[country].datatypeProperties[consts.CUSTOM.LOCATION_DESCRIPTION] = locGrd;
        }
	});
    let objectProperties = root[country].objectProperties;
	cheerioElem('#field-geographic-coordinates').each(function() {
        let geoAttr = getRelation(objectProperties, consts.CUSTOM.HAS_LOCATION);
        if (geoAttr) { return; }

        var geoGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (geoGrd) {
			let coords = geoGrd.split(',');
			let latSplit = coords[0].trim().split(' ');
			let lat = (latSplit[0].includes('S') ? -1 : 1) * Number(latSplit[0].trim() + '.' + latSplit[1].trim());
			let lngSplit = coords[1].trim().split(' ');
			let lng = (lngSplit[0].includes('W') ? -1 : 1) * Number(lngSplit[0].trim() + '.' + lngSplit[1].trim());
			
			var datatypeProp = {};
			datatypeProp[consts.WGS84_POS.LAT] = lat;
			datatypeProp[consts.WGS84_POS.LONG] = lng;
			datatypeProp[consts.WGS84_POS.LAT_LONG] = `${lat}, ${lng}`;

			var objectProp = {};
			objectProp[consts.CUSTOM.HAS_LOCATION] = {
				id: consts.CUSTOM.INST_GEO_LOCATION + getUuid(country),
				label: 'Lat/Long location of ' + country + '.',
				type: consts.CUSTOM.ONT_GEO_LOCATION,
				datatypeProperties: datatypeProp,
				objectProperties: []
			};

            root[country].objectProperties.push(objectProp);
        }
    });
	cheerioElem('#field-map-references').each(function() {
        let mapReferenceAttr = root[country].datatypeProperties[consts.CUSTOM.MAP_REFERENCES];
        if (mapReferenceAttr) { return; }

        var mapRef = cheerioElem(this).find('div.category_data.subfield.text').text().trim();
        if (mapRef) {
            root[country].datatypeProperties[consts.CUSTOM.MAP_REFERENCES] = mapRef;
        }
	});
};

var getRegionMapImg = function(cheerioElem, country, root) {
    let objectProperties = root[country].objectProperties;
    cheerioElem('div.mapBox').each(function() {
        let map = getRelation(objectProperties, consts.CUSTOM.HAS_REGION_MAP);
        if (map && map.datatypeProperties && map.datatypeProperties[consts.CUSTOM.LOCATION_URI]) { return; }

        var a = cheerioElem(this).find('img').attr('src');
        var regionMapImgUrl;
        if (a && a.replace('../', '')) {
            regionMapImgUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
        }
        if (regionMapImgUrl) {
			var datatypeProp = {};
			datatypeProp[consts.CUSTOM.LOCATION_URI] = regionMapImgUrl;

			var objectProp = {};
			objectProp[consts.CUSTOM.HAS_REGION_MAP] = {
				id: consts.CUSTOM.INST_REGION_MAP + getUuid(country),
				label: 'Map of ' + country + ' and its border nations',
				type: consts.CUSTOM.ONT_REGION_MAP,
				datatypeProperties: datatypeProp,
				objectProperties: []
			};

            root[country].objectProperties.push(objectProp);
        }
        // TODO: scrape physical image from url and store it.
    });
};

var getSupllementalImages = function(cheerioElem, country, root) {
    let objectProperties = root[country].objectProperties;
    cheerioElem('div.item.photo-all').each(function() {
        let suppImages = objectProperties.filter(rel => rel[consts.CUSTOM.HAS_SUPPLEMENTAL_IMG]);

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
			var datatypeProp = {};
			datatypeProp[consts.CUSTOM.LOCATION_URI] = suppImgUrl;
			datatypeProp[consts.CUSTOM.IMAGE_DIMENSIONS] = imageProps[0] || 'N/A';
			datatypeProp[consts.CUSTOM.IMAGE_SIZE] = imageProps[1] || 'N/A';

			var objectProp = {};
			objectProp[consts.CUSTOM.HAS_SUPPLEMENTAL_IMG] = {
				id: consts.CUSTOM.INST_IMAGE + getUuid(country),
				label: b || null,
				type: consts.CUSTOM.ONT_IMAGE,
				datatypeProperties: datatypeProp,
				objectProperties: []
			};

            root[country].objectProperties.push(objectProp);
		}
        // TODO: scrape physical image from url and store it.
    });
};

module.exports = {
	getArea,
	getBackground,
	getBorderMapImg,
	getClimate,
	getCoastLength,
	getFlag,
	getGeography,
	getRegionMapImg,
	getSupllementalImages
};

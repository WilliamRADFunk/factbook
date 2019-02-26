const getUuid = require('uuid-by-string');
const htmlToText = require('html-to-text');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');

var getSupllementalImages = function(cheerioElem, country, countryId) {
    let objectProperties = store.countries[countryId].objectProperties;
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
			datatypeProp[consts.CUSTOM.CONTENT_DESCRIPTION] = b || null;
			datatypeProp[consts.CUSTOM.IMAGE_DIMENSIONS] = imageProps[0] || 'N/A';
			datatypeProp[consts.CUSTOM.IMAGE_SIZE] = imageProps[1] || 'N/A';

			var objectProp = {};
			objectProp[consts.CUSTOM.HAS_SUPPLEMENTAL_IMG] = {
				id: consts.CUSTOM.INST_IMAGE + getUuid(country),
				label: 'hasSupplementalImage',
				type: consts.CUSTOM.ONT_IMAGE,
				datatypeProperties: datatypeProp,
				objectProperties: []
			};

            store.countries[countryId].objectProperties.push(objectProp);
		}
        // TODO: scrape physical image from url and store it.
    });
};

module.exports = getSupllementalImages;
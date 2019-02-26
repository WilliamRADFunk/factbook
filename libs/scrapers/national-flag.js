const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');

var getFlag = function(cheerioElem, country, countryId) {
    let objectProperties = store.countries[countryId].objectProperties;
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
				label: 'hasNationalFlag',
				type: consts.CUSTOM.ONT_FLAG,
				datatypeProperties: datatypeProp,
				objectProperties: []
			};

            store.countries[countryId].objectProperties.push(objectProp);
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
				label: 'hasNationalFlag',
				type: consts.CUSTOM.ONT_FLAG,
				datatypeProperties: datatypeProp,
				objectProperties: []
			};

            store.countries[countryId].objectProperties.push(objectProp);
        }
    });
};

module.exports = getFlag;
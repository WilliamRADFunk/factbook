const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const getRelation = require('../utils/get-objectProperty.js');
const entityMaker = require('../utils/entity-maker.js');

var getFlag = function(cheerioElem, country, countryId) {
    let objectProperties = store.countries[countryId].objectProperties;
	let flag = getRelation(objectProperties, consts.CUSTOM.HAS_FLAG);
	var fId = consts.CUSTOM.INST_FLAG + getUuid(country);
	var objectProp = {};
	if (!flag) {
		if (store.nationalFlags[fId]) {
			objectProp[consts.CUSTOM.HAS_FLAG] = store.nationalFlags[fId];
		} else {
			objectProp = entityMaker(
				consts.CUSTOM.HAS_FLAG,
				consts.CUSTOM.ONT_FLAG,
				fId,
				'hasNationalFlag');
			store.nationalFlags[fId] = objectProp[consts.CUSTOM.HAS_FLAG];
		}
		flag = objectProp[consts.CUSTOM.HAS_FLAG];
		store.countries[countryId].objectProperties.push(objectProp);
	}
    cheerioElem('div.flagBox').each(function() {
        var a = cheerioElem(this).find('img').attr('src');
        var flagImgUrl;
        if (a && a.replace('../', '')) {
            flagImgUrl = consts.CUSTOM.URL_BASE + a.replace('../', '');
		}
        if (flagImgUrl) {
			flag.datatypeProperties[consts.CUSTOM.LOCATION_URI] = flagImgUrl;
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
			flag.datatypeProperties[consts.CUSTOM.CONTENT_DESCRIPTION] = a.trim();
        }
    });
};

module.exports = getFlag;
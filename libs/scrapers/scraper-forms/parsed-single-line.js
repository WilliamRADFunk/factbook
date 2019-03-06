const getUuid = require('uuid-by-string');

const consts = require('../../constants/constants');
const store = require('../../constants/globalStore');
const entityMaker = require('../../utils/entity-maker.js');
const entityRefMaker = require('../../utils/entity-ref-maker.js');

const parsedSingleLine = function(origParams, dataId, hasProp, instProp, baseOntProp, storeKey, dataPropName, label, delimiter) {
	let objectProperties = store.countries[origParams.countryId].objectProperties;
	let prevHasList = objectProperties.filter(rel => rel[consts.CUSTOM[hasProp]]);
	origParams.cheerioElem(dataId).each(function() {
		var rawScrapedList = origParams.cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (rawScrapedList) {
			const splitList = rawScrapedList.split(delimiter).map(x => x.trim());
			splitList.forEach(resource => {
				const dataPropItem = resource.trim();
				var guid = consts.CUSTOM[instProp] + getUuid(dataPropItem);
				const hasPropAlready = prevHasList.some(p => p[consts.CUSTOM[hasProp]].id.includes(guid));
				if (dataPropItem && !hasPropAlready) {
					var objectProp = {};
					if (store[storeKey][guid]) {
						objectProp[consts.CUSTOM[hasProp]] = store[storeKey][guid];
					} else {
						objectProp = entityMaker(
							consts.CUSTOM[hasProp],
							consts.CUSTOM[baseOntProp],
							guid,
							label);
						store[storeKey][guid] = objectProp[consts.CUSTOM[hasProp]];
					}
					objectProp[consts.CUSTOM[hasProp]].datatypeProperties[dataPropName] = dataPropItem;
					store.countries[origParams.countryId].objectProperties.push(entityRefMaker(consts.CUSTOM[hasProp], objectProp));
				}
			});
        } else {
			return;
		}
	});
};

module.exports = parsedSingleLine;
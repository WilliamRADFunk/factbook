const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const entityMaker = require('../utils/entity-maker.js');
const entityRefMaker = require('../utils/entity-ref-maker.js');

var getNaturalResources = function(cheerioElem, country, countryId) {
	let objectProperties = store.countries[countryId].objectProperties;
	let natResources = objectProperties.filter(rel => rel[consts.CUSTOM.HAS_NATURAL_RESOURCE]);
	cheerioElem('#field-natural-resources').each(function() {
		var resourceList = cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
		if (resourceList) {
			const resources = resourceList.split(',').filter(name => name !== 'none');
			resources.forEach(resource => {
				let resourceName = resource.trim();
				var nrId = consts.CUSTOM.INST_NATURAL_RESOURCE + getUuid(resourceName);
				let doesResourceExist = natResources.some(natRes => natRes[consts.CUSTOM.HAS_NATURAL_RESOURCE].id.includes(nrId));
				if (resourceName && !doesResourceExist) {
					var objectProp = {};
					if (store.naturalResources[nrId]) {
						objectProp[consts.CUSTOM.HAS_NATURAL_RESOURCE] = store.naturalResources[nrId];
					} else {
						objectProp = entityMaker(
							consts.CUSTOM.HAS_NATURAL_RESOURCE,
							consts.CUSTOM.ONT_NATURAL_RESOURCE,
							nrId,
							'Natural Resource');
						store.naturalResources[nrId] = objectProp[consts.CUSTOM.HAS_NATURAL_RESOURCE];
					}
					objectProp[consts.CUSTOM.HAS_NATURAL_RESOURCE].datatypeProperties.resourceName = resourceName;
					store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_NATURAL_RESOURCE, objectProp));
				}
			});
		} else {
			return;
		}
	});
};

module.exports = getNaturalResources;
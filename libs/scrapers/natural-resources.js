const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const entityMaker = require('../utils/entity-maker.js');
const entityRefMaker = require('../utils/entity-ref-maker.js');

var getNaturalResources = function(cheerioElem, country, countryId) {
	let objectProperties = store.countries[countryId].objectProperties;
	cheerioElem('#field-natural-resources').each(function() {
		var resourceList = cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (resourceList) {
			const resources = resourceList.split(',').filter(name => name !== 'none');
			resources.forEach(resource => {
				let resourceName = resource.trim();
				let doesResourceExist = objectProperties.filter(rel => rel[consts.CUSTOM.HAS_NATURAL_RESOURCE])[0];
				if (!doesResourceExist || (doesResourceExist && doesResourceExist.datatypeProperties.resourceName !== resourceName)) {
					var nrId = consts.CUSTOM.INST_NATURAL_RESOURCE + getUuid(country);
					var objectProp = {};
					if (store.naturalResources[nrId]) {
						objectProp[consts.CUSTOM.HAS_NATURAL_RESOURCE] = store.naturalResources[nrId];
					} else {
						objectProp = entityMaker(
							consts.CUSTOM.HAS_NATURAL_RESOURCE,
							consts.CUSTOM.ONT_NATURAL_RESOURCE,
							nrId,
							`Natural Resource for ${country}`);
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
const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const entityMaker = require('../utils/entity-maker.js');
const entityRefMaker = require('../utils/entity-ref-maker.js');

var getTerrains = function(cheerioElem, country, countryId) {
	let objectProperties = store.countries[countryId].objectProperties;
	cheerioElem('#field-terrain').each(function() {
		var terrainList = cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
		console.log('terrain - 1', country, terrainList);
        if (terrainList) {
			const terrains = terrainList.split(';').map(t => t.trim());
			console.log('terrain - 2', country, terrains);
			terrains.forEach(resource => {
				console.log('terrain - 3', country, resource);
				let terrainDescription = resource.trim();
				let doesResourceExist = objectProperties.filter(rel => rel[consts.CUSTOM.HAS_TERRAIN])[0];
				console.log('terrain - 4', country, doesResourceExist);
				if (!doesResourceExist || (doesResourceExist && doesResourceExist.datatypeProperties.terrainDescription !== terrainDescription)) {
					var tId = consts.CUSTOM.INST_TERRAIN + getUuid(country);
					var objectProp = {};
					if (store.terrains[tId]) {
						objectProp[consts.CUSTOM.HAS_TERRAIN] = store.terrains[tId];
					} else {
						objectProp = entityMaker(
							consts.CUSTOM.HAS_TERRAIN,
							consts.CUSTOM.ONT_TERRAIN,
							tId,
							`Terrain for ${country}`);
						store.terrains[tId] = objectProp[consts.CUSTOM.HAS_TERRAIN];
					}
					objectProp[consts.CUSTOM.HAS_TERRAIN].datatypeProperties.terrainDescription = terrainDescription;
					store.countries[countryId].objectProperties.push(entityRefMaker(consts.CUSTOM.HAS_TERRAIN, objectProp));
				}
			});
        } else {
			return;
		}
	});
};

module.exports = getTerrains;
const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');
const store = require('../constants/globalStore');
const entityMaker = require('../utils/entity-maker.js');
const entityRefMaker = require('../utils/entity-ref-maker.js');

var getTerrains = function(cheerioElem, country, countryId) {
	let objectProperties = store.countries[countryId].objectProperties;
	let terr = objectProperties.filter(rel => rel[consts.CUSTOM.HAS_TERRAIN]);
	cheerioElem('#field-terrain').each(function() {
		var terrainList = cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (terrainList) {
			const terrains = terrainList.split(';').map(t => t.trim());
			terrains.forEach(resource => {
				const terrainDescription = resource.trim();
				var tId = consts.CUSTOM.INST_TERRAIN + getUuid(terrainDescription);
				const doesResourceExist = terr.some(t => t[consts.CUSTOM.HAS_TERRAIN].id.includes(tId));
				if (terrainDescription && !doesResourceExist) {
					var objectProp = {};
					if (store.terrains[tId]) {
						objectProp[consts.CUSTOM.HAS_TERRAIN] = store.terrains[tId];
					} else {
						objectProp = entityMaker(
							consts.CUSTOM.HAS_TERRAIN,
							consts.CUSTOM.ONT_TERRAIN,
							tId,
							'Terrain');
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
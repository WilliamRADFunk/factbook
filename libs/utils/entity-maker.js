var entityMaker = function(predicateURI, typeURI, instId, label) {
	var objectProp = {};
	objectProp[predicateURI] = {
		id: instId,
		label: label,
		type: typeURI,
		datatypeProperties: {},
		objectProperties: []
	};
	return objectProp;
};

module.exports = entityMaker;
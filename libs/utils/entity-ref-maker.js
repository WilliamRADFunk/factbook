var entityRefMaker = function(predicateURI, entity) {
	var objectProp = {};
	objectProp[predicateURI] = {
		id: entity[predicateURI].id,
		label: entity[predicateURI].label,
		type: entity[predicateURI].type
	};
	return objectProp;
};

module.exports = entityRefMaker;
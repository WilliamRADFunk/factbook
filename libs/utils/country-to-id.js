const getUuid = require('uuid-by-string');

const consts = require('../constants/constants');

var countryToId = function(country) {
    return consts.CUSTOM.INST_COUNTRY + getUuid(country);
};

module.exports = countryToId;

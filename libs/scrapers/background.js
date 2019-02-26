const consts = require('../constants/constants');
const store = require('../constants/globalStore');

var getBackground = function(cheerioElem, country, countryId) {
	cheerioElem('#field-background').each(function() {
        var bckGrd = cheerioElem(this).find('div.category_data.subfield.text').text().trim().replace(/\\n/g, '');
        if (bckGrd) {
            store.countries[countryId].datatypeProperties[consts.CUSTOM.BACKGROUND] = bckGrd;
        }
    });
};

module.exports = getBackground;
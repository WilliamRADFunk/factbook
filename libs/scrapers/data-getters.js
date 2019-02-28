const getBackground = require('./background');
const getBorders = require('./borders');
const getBorderMapImg = require('./border-map-image');
const getClimate = require('./climate');
const getCoastLength = require('./coast-length');
const getArea = require('./domain-area');
const getGeography = require('./geography');
const getFlag = require('./national-flag');
const getRegionMapImg = require('./region-map-image');
const getSupplementalImages = require('./supplemental-image');
const getMaritimeClaims = require('./maritime-claims');

module.exports = {
	getArea,
	getBackground,
	getBorderMapImg,
	getBorders,
	getClimate,
	getCoastLength,
	getFlag,
	getGeography,
	getRegionMapImg,
	getSupplementalImages,
	getMaritimeClaims
};

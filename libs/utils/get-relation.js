const hasProp = require('./has-prop');

module.exports = function(relationList, propName) {
    let propNameChain = Array.isArray(propName) ? propName : [propName];
    let rel = relationList.find(relation => { return !!hasProp(relation, propNameChain); });
    return rel && rel[propNameChain[0]];
};

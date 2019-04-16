"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hasProp(base, propName) {
    var name = propName[0];
    if (!name) {
        return base;
    }
    else if (base && !base[name]) {
        return null;
    }
    return hasProp(base[name], propName.slice(1));
}
exports.hasProp = hasProp;
;

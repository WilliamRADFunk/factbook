export function hasProp(base, propName) {
    if (!propName[0]) {
        return base;
    } else if (base && !base[propName[0]]) {
        return;
    }
    return hasProp(base[propName[0]], propName.slice(1));
};

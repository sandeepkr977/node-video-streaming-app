let map = new Map();

let get = (id) => {
    return map.get(id);
}

let put = (k, v) => {
    return map.set(k, v);
}

let getValues = () => {
    let values = [];
    map.forEach((v, k, m) => values.push(v));
    return values;
}

module.exports = {
    get,
    put,
    getValues
};
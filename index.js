

var storage = {};



function set(key, value, options) {

    // var options = {
    //     ex: -1,
    //     px: -1,
    //     exat: -1,
    //     nx: false,
    //     xx: false,
    //     keepTtl: false,
    //     get: false
    // }

    var currentTime = Date.now();
    var ttl = undefined;

    if (options.ex >= 0) {
        ttl = currentTime + options.ex * 1000;
    }
    if (options.px >= 0) {
        ttl = currentTime + options.px;
    }
    if (options.exat >= 0) {
        ttl = options.exat;
    }

    const oldValue = storage[key];

    if (oldValue != undefined && options.nx) {
        return undefined;
    }

    if (oldValue == undefined && options.xx) {
        return undefined;
    }

    var newValue = {
        value: value,
        ttl: ttl
    }

    if (options.keepTtl && oldValue.ttl != undefined) {
        newValue.ttl = oldValue.ttl;
    }

    storage[key] = newValue;

    if (options.get) {
        if (oldValue != undefined) {
            return oldValue.value;
        } else {
            return null;
        }
    }

    return true;
}

exports.set = set;

function get(key) {
    if (key == undefined || key == '') {
        return 'Error: invalid arguments'
    }
    var value = storage[key];
    if (value == undefined) {
        return null;
    }

    return value.value;
}

exports.get = get;

function del(keys) {
    var counter = 0;
    keys.forEach((key) => {
        var value = storage[key];
        if (value != undefined) {
            delete storage[key];
            counter++;
        }
    });
    return counter;
}

exports.del = del;

function keys(pattern) {
    var allkeys = Object.keys(storage);
    return allkeys;
}

exports.keys = keys;

function cleanUp() {
    let currentTime = Date.now();

    let keys = Object.keys(storage);

    keys.forEach((key) => {
        let ttl = storage[key].ttl;
        if (ttl != undefined) {
            if (currentTime > ttl) {
                delete storage[key];
            }
        }
    })
}


const main = () => {

    

    setInterval(cleanUp, 1);

    
}



main();
const { response } = require("express");


var storage = {};



function SET(key, value, options) {

    // var options = {
    //     ex: -1,
    //     px: -1,
    //     exat: -1,
    //     nx: false,
    //     xx: false,
    //     keepTtl: false,
    //     get: false
    // }

    function output(response, value = null, error = null) {
        return {
            response: response,
            value: value,
            error: error
        };
    }

    var currentTime = Date.now();
    var ttl;

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
        return output(false);
    }

    if (oldValue == undefined && options.xx) {
        return output(false);;
    }

    var newValue = {
        type: 'SIMPLE',
        value: value,
        ttl: ttl
    }

    if (options.keepTtl && oldValue.ttl != undefined) {
        newValue.ttl = oldValue.ttl;
    }

    

    if (options.get) {
        if (oldValue != undefined) {
            if (oldValue.type == 'SIMPLE') {
                storage[key] = newValue;
                return output(true, oldValue.value);
            }
            return output(false, null, "Wrong type");
        } else {
            storage[key] = newValue;
            return output(true);
        }
    }

    storage[key] = newValue;
    return output(true);
}

exports.SET = SET;

function GET(key) {

    function output(value, error = null){
        return {
            value: value,
            error: error
        };
    }

    var value = storage[key];

   

    
    if (value == undefined) {
        return output(null);
    }

    if(value.type != 'SIMPLE'){
        return output(null, "Wrong type");
    }

    return output(value.value);
}

exports.GET = GET;

function DEL(keys) {
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

exports.DEL = DEL;

function KEYS(pattern) {
    var allkeys = Object.keys(storage);
    console.log(storage);
    return allkeys;
}

exports.KEYS = KEYS;

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



function HSET(key, field, value) {
    if (storage[key] == undefined || storage[key].type != 'HASH') {
        storage[key] = {
            type: 'HASH',
            value: {}
        }
    }

    storage[key].value[field] = value;

}

exports.HSET = HSET;

function HGET(key, field) {


    let output = {
        error: null,
        value: null
    };

    if (storage[key] == undefined) {
        return output;
    }

    if (storage[key].type != 'HASH') {
        output.error = 'Wrong type';
        return output;
    }

    if (storage[key].value[field] == undefined) {
        return output;
    }

    output.value = storage[key].value[field];
    return output;
}

exports.HGET = HGET;

const main = () => {



    setInterval(cleanUp, 1);


}



main();
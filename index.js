const readline = require("readline");

var storage = {};

function parseCommandOptions(options, args) {
    var keys = Object.keys(options);
    for (var i = 0; i < args.length; i++) {
        var key = null;
        for (var j = 0; j < keys.length; j++) {
            if (args[i].toLowerCase() == keys[j].toLowerCase()) {
                key = keys[j];
                break;
            }
        }
        if (key != null) {
            if (typeof(options[key]) != 'boolean') {
                options[key] = parseInt(args[i + 1]);
                i++;
            } else {
                options[key] = true;
            }
        } else {
            return false;
        }
    }
    return true;
}

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

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const getCommand = () => {
        rl.question("> ", function(command) {
            processCommand(command)
            getCommand();
        });
    }

    const processCommand = (command) => {

        var args = command.split(' ');
        command = args[0];
        // console.log(args, command);
        var output = '';

        switch (command) {
            case 'get':
                {
                    output = get(args[1]);
                    break;
                }
            case 'set':
                {
                    output = set(args[1], args[2], args.slice(3));
                    break;
                }
            case 'del':
                {
                    output = del(args.slice(1));
                    break;
                }
            case 'keys':
                {
                    output = keys('');
                    break;
                }
        }
        console.log(output);
    }

    setInterval(cleanUp, 1);

    getCommand();



    rl.on("close", function() {
        console.log("\nBYE BYE !!!");
        process.exit(0);
    });
}



main();
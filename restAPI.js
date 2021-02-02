var express = require('express');
var redis = require('./index');

var app = express();
app.use(express.json());

app.get('/keys/:key', (req, res) => {
    res.json({ value: redis.get(req.params.key)});
});

app.get('/keys', (req, res) => {
    res.json(redis.keys(''));
})

app.post('/keys/:key', (req, res) => {
    var options = {};
    var optionsTypes = {
        ex: 'int',
        px: 'int',
        exat: 'int',
        nx: 'boolean',
        xx: 'boolean',
        keepttl: 'boolean',
        get: 'boolean'
    }
    Object.keys(optionsTypes).forEach(key => {
        let tmp = typeConverter(req.query[key], optionsTypes[key]);
        if(tmp != undefined){
            options[key] = tmp;
        }
    });
    // console.log(options);
    // res.send(JSON.stringify(options));
    console.log(req.body);
    let result = redis.set(req.params.key, req.body.value, options);
    if(result === true){
        res.sendStatus(200);
    } else {
        res.json({value: result});
    }
});

app.delete('/keys/:key', (req, res) => {
    res.json({result: redis.del([req.params.key])});
})

app.delete('/keys', (req, res) => {
    var keys = req.query.keys;
    res.json({result: redis.del(keys)});
})

var server = app.listen(1337, "127.0.0.1", () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`Listening at http://${host}:${port}`);
})


const typeConverter = (value, neededtype) => {
    if(value == undefined){
        return undefined;
    }
    switch(neededtype){
        case 'boolean': {
            return (value === 'true');
        }
        case 'int': {
            value = parseInt(value);
            if(Number.isInteger(value)){
                return value;
            } else {
                return undefined;
            }
        }
        case 'string': {
            return value.toString();
        }
    }
}
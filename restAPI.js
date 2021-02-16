var express = require("express");
var redis = require("./index");

var app = express();
app.use(express.json({strict: false}));

//GET
app.get("/keys/:key", (req, res) => {
  let { value, error } = redis.GET(req.params.key);
  if (error) {
    res.status(400).json(error);
    return;
  }
  console.log(value);
  res.status(200).json(value);
});

//KEYS
app.get("/keys", (req, res) => {
  res.json(redis.KEYS(""));
});

//SET
app.post("/keys/:key", (req, res) => {
  var options = {};
  var optionsTypes = {
    ex: "int",
    px: "int",
    exat: "int",
    nx: "boolean",
    xx: "boolean",
    keepttl: "boolean",
    get: "boolean",
  };
  Object.keys(optionsTypes).forEach((key) => {
    let tmp = typeConverter(req.query[key], optionsTypes[key]);
    if (tmp != undefined) {
      options[key] = tmp;
    }
  });
  console.log(options);
  // res.send(JSON.stringify(options));
  let value = req.body;
  if (value == undefined) {
    res.sendStatus(400);
    return;
  }
  let { response, returnvalue, error } = redis.SET(
    req.params.key,
    value,
    options
  );
  console.log(response);
  if (response == true) {
    res.status(200);
    if (returnvalue) {
      res.json(returnvalue);
      return;
    } else {
      res.json({});
      return;
    }
    
  } else {
    res.status(400);
    if (error) {
      res.json(error);
      return;
    } else {
      res.json({});
      return;
    }
  }
});

//HSET
app.post("/keys/:key/:field", (req, res) => {
  let key = req.params.key;
  let field = req.params.field;
  let value = req.body;

  if (value == undefined) {
    res.status(400).json({
      error: "No value has been provided!",
    });
    return;
  }

  redis.HSET(key, field, value);
  res.status(200);
  res.json({});
});

//HGET
app.get("/keys/:key/:field", (req, res) => {
  let key = req.params.key;
  let field = req.params.field;

  let { error, value } = redis.HGET(key, field);
  if (error) {
    res.status(400).json(error);
  }

  res.status(200).json(value);
});

//DELL one key
app.delete("/keys/:key", (req, res) => {
  res.status(200).json(redis.del([req.params.key]));
});

//DELL many keys
app.delete("/keys", (req, res) => {
  var keys = req.body.keys;
  console.log(req.body);
  res.json({ result: redis.del(keys) });
});

var server = app.listen(1337, "127.0.0.1", () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Listening at http://${host}:${port}`);
});

const typeConverter = (value, neededtype) => {
  if (value == undefined) {
    return undefined;
  }
  switch (neededtype) {
    case "boolean": {
      return value === "true";
    }
    case "int": {
      value = parseInt(value);
      if (Number.isInteger(value)) {
        return value;
      } else {
        return undefined;
      }
    }
    case "string": {
      return value.toString();
    }
  }
};

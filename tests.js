const redis = require("./index");
const assert = require("assert").strict;

//SET tests
var expectedResponse = {
  response: true,
  value: null,
  error: null,
};

var response = redis.SET("test1", "testing", {});
assert.deepEqual(response, expectedResponse);
console.log("Passed");

var expectedResponse = {
  response: true,
  value: "testing",
  error: null,
};

var options = {
  get: true,
};
var response = redis.SET("test1", "keksting", options);
assert.deepEqual(response, expectedResponse);
console.log("Passed");

var expectedResponse = {
  response: true,
  value: null,
  error: null,
};
var options = {
  ex: 3,
};
var response = redis.SET("test1", "testing", options);
assert.deepEqual(response, expectedResponse);
console.log("Passed");
var response = redis.GET("test1");
var expectedResponse = {
  value: "testing",
  error: null,
};
assert.deepEqual(response, expectedResponse);
setTimeout(() => {
  var response = redis.GET("test1");
  var expectedResponse = {
    value: "testing",
    error: null,
  };
  assert.deepEqual(response, expectedResponse);
  console.log("Passed");
}, 2 * 1000);

setTimeout(() => {
    var response = redis.GET("test1");
    var expectedResponse = {
      value: null,
      error: null,
    };
    assert.deepEqual(response, expectedResponse);
    console.log("Passed");
  }, 4 * 1000);

// process.exit();

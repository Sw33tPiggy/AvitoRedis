const readline = require("readline");
const fetch = require("node-fetch");
const { HGET } = require(".");

const main = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const getCommand = () => {
    rl.question("> ", async function (command) {
      if (command.length > 0) {
        await processCommand(command);
      }
      getCommand();
    });
  };

  const processCommand = async (command) => {
    var args = command.split(" ");
    command = args[0];
    // console.log(args, command);

    switch (command) {
      case "get": {
        await get(args[1])
          .then((output) => console.log(output))
          .catch((error) => console.log(error));
        break;
      }
      case "set": {
        await set(args[1], args[2], args.slice(3))
          .then((output) => console.log(output))
          .catch((error) => console.log(error));
        break;
      }
      case "del": {
        await del(args.slice(1))
          .then((output) => console.log(output))
          .catch((error) => console.log(error));
        break;
      }
      case "keys": {
        await keys("")
          .then((output) => console.log(output))
          .catch((error) => console.log(error));
        break;
      }
      case "hget": {
        await hget(args[1], args[2])
          .then((output) => console.log(output))
          .catch((error) => console.error(error));
        break;
      }
      case "hset": {
        await hset(args[1], args[2], args[3])
          .then((output) => console.log(output))
          .catch((error) => console.error(error));
        break;
      }

      default: {
        console.log("Unknown command");
      }
    }
  };

  getCommand();

  rl.on("close", function () {
    console.log("\nBYE BYE !!!");
    process.exit(0);
  });
};

main();

const host = "localhost";
const port = 1337;

function keys(pattern) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  var address = `http://${host}:${port}/keys`;

  return new Promise((resolve, reject) => {
    fetch(address, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        var output = "";
        result.forEach((e) => {
          output = output + e + "\n";
        });
        output = output.slice(0, -1);
        resolve(output);
      })
      .catch((error) => reject("error", error));
  });
}

function get(key) {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  var address = `http://${host}:${port}/keys/${key}`;

  return new Promise((resolve, reject) => {
    fetch(address, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result.value);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function hget(key, field) {
  var requestOptions = {
    method: "GET",
  };

  var address = `http://${host}:${port}/keys/${key}/${field}`;

  return new Promise((resolve, reject) => {
    fetch(address, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function hset(key, field, value) {
  var address = `http://${host}:${port}/keys/${key}/${field}`;
  var body = JSON.stringify(value);

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  };

  return new Promise((resolve, reject) => {
    fetch(address, requestOptions)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((result) => {
              if (result.value) {
                resolve(result.value);
              } else {
                resolve("OK");
              }
            })
            .catch((error) => reject(error));
        } else {
          response.text().then((result) => reject(result));
        }
      })
      .catch((error) => reject(error));
  });
}

function parseCommandOptions(options, args, optionsTypes) {
  var keys = Object.keys(optionsTypes);
  for (var i = 0; i < args.length; i++) {
    var key = null;
    for (var j = 0; j < keys.length; j++) {
      if (args[i].toLowerCase() == keys[j].toLowerCase()) {
        key = keys[j];
        break;
      }
    }
    if (key != null) {
      if (typeof optionsTypes[key] != "boolean") {
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

function optionsToQuarry(options) {
  var query = "";
  for (key in options) {
    query += `${key}=${options[key]}&`;
  }
  return query;
}

function set(key, value, args) {
  var optionsTypes = {
    ex: -1,
    px: -1,
    exat: -1,
    nx: false,
    xx: false,
    keepTtl: false,
    get: false,
  };

  var options = {};

  if (!parseCommandOptions(options, args, optionsTypes)) {
    return Promise.reject();
  }

  var query = optionsToQuarry(options);

  var body = JSON.stringify({ value: value });
  // console.log(body);

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  };

  var address = `http://${host}:${port}/keys/${key}?${query}`;

  return new Promise((resolve, reject) => {
    fetch(address, requestOptions)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((result) => {
              if (result.value) {
                resolve(result.value);
              } else {
                resolve("OK");
              }
            })
            .catch((error) => reject(error));
        } else {
          response.text().then((result) => reject(result));
        }
      })
      .catch((error) => reject(error));
  });
}

function del(keys) {
  if (keys.length < 1) {
    return Promise.reject();
  }

  var address;
  var requestOptions = {
    method: "DELETE",
  };

  if (keys.length == 1) {
    address = `http://${host}:${port}/keys/${keys[0]}`;
  } else {
    address = `http://${host}:${port}/keys`;
    requestOptions.headers = {
      "Content-Type": "application/json",
    };
    requestOptions.body = JSON.stringify({ keys });
  }

  return new Promise((resolve, reject) => {
    fetch(address, requestOptions)
      .then((response) => response.text())
      .then((result) => resolve(result.result))
      .catch((error) => reject(error));
  });
}

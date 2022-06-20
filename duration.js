require("dotenv").config();
var exec = require("child_process").exec;
var api_key = require("./config/config");

var child;

var executingQuery = "ypd-init " + api_key.youtubeAPI;

child = exec(executingQuery, function (error, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);
});

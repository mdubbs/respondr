var express = require('express');
var router = express.Router();
var pjson = require('../package.json');

router.get('/', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({message: "respondr", version: pjson.version}));
});

module.exports = router;

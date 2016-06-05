var express = require('express');
var router = express.Router();
var pjson = require('../package.json');
var assert = require('assert');
var mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
var rollbar = require('rollbar');

// models
var Message = require('../models/messageSchema');
var Chain = require('../models/chainSchema');

var handleError = function(url, err, res) {
    rollbar.reportMessage(err);
    res.status(500);
    res.send(JSON.stringify({url: url, message: err.message}));
}

router.get('/', function(req, res) {
    res.send(JSON.stringify({message: "respondr admin", version: pjson.version}));
});

router.get('/messages', function(req, res) {
    var url = "/admin/messages";

    Message.find({}, function(err, result) {
        if(err) {
            handleError(url, err, res);
        } else {
            res.send(JSON.stringify({url: url, results: result}));
        }
    });
});

router.get('/messages/:id', function(req, res) {
    var messageId = req.params.id;
    var url = "/admin/messages/"+messageId;
    Message.findById(messageId, function(err, message){
        if(err) {
            handleError(url, err, res);
        } else {
            if(message != null) {
                message.url = url;
                res.send(JSON.stringify(message));
            } else {
                res.status(404);
                res.send(JSON.stringify({message:"message not found"}));
            }
        }
    });
});

router.delete('/messages/', function(req, res) {
    var messageId = req.body.id;
    Message.findOneAndRemove({'_id': messageId}, function(err, result){
        if(err) {
            handleError(url, err, res);
        } else {
            res.send(JSON.stringify({message:"message "+messageId+" deleted"}));
        }
    });
});

router.get('/chains', function(req, res) {
    var url = "/admin/chains";

    Chain.find({}, function(err, result) {
        if(err) {
            handleError(url, err, res);
        } else {
            res.send(JSON.stringify({url: url, results: result}));
        }
    });
});

module.exports = router;

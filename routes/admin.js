var express = require('express');
var router = express.Router();
var pjson = require('../package.json');
var assert = require('assert');
var mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
var rollbar = require('rollbar');

// models
var Message = require('../models/message');
var Ticket = require('../models/ticket');

var handleError = function(url, err, res) {
    rollbar.reportMessage(err);
    res.status(500);
    res.send(JSON.stringify({url: url, message: err.message}));
}

// INDEX
router.get('/', function(req, res) {
    res.send(JSON.stringify({message: "respondr admin", version: pjson.version}));
});

// MESSAGES
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

// TICKETS
router.get('/tickets', function(req, res) {
    var url = "/admin/tickets";

    Chain.find({}, function(err, result) {
        if(err) {
            handleError(url, err, res);
        } else {
            res.send(JSON.stringify({url: url, results: result}));
        }
    });
});

router.get('/tickets/:id', function(req, res) {
    var ticketId = req.params.id;
    var url = "/admin/tickets/"+ticketId;
    Ticket.findById(ticketId, function(err, message){
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

router.post('/tickets/:id/reviewed', function(req, res){
    var ticketId = req.params.id;
    var url = "/admin/tickets/"+ticketId+"/reviewed";
    Ticket.findOneAndUpdate({'_id': ticketId}, {reviewed:true}, function(err, result){
        if(err) {
            handleError(url, err, res);
        } else {
            res.send(JSON.stringify({message:"ticket "+ticketId+" marked as reviewed"}));
        }
    });
});

router.post('/tickets/:id/pending', function(req, res){
    var ticketId = req.params.id;
    var url = "/admin/tickets/"+ticketId+"/pending";
    Ticket.findOneAndUpdate({'_id': ticketId}, {status:"Pending"}, function(err, result){
        if(err) {
            handleError(url, err, res);
        } else {
            res.send(JSON.stringify({message:"ticket "+ticketId+" has been closed"}));
        }
    });
});

router.post('/tickets/:id/completed', function(req, res){
    var ticketId = req.params.id;
    var url = "/admin/tickets/"+ticketId+"/completed";
    Ticket.findOneAndUpdate({'_id': ticketId}, {status:"Completed"}, function(err, result){
        if(err) {
            handleError(url, err, res);
        } else {
            res.send(JSON.stringify({message:"ticket "+ticketId+" has been closed"}));
        }
    });
});

router.post('/tickets/:id/close', function(req, res){
    var ticketId = req.params.id;
    var url = "/admin/tickets/"+ticketId+"/close";
    Ticket.findOneAndUpdate({'_id': ticketId}, {status:"Closed"}, function(err, result){
        if(err) {
            handleError(url, err, res);
        } else {
            res.send(JSON.stringify({message:"ticket "+ticketId+" has been closed"}));
        }
    });
});

router.delete('/tickets/', function(req, res) {
    var ticketId = req.body.id;
    var url = "/admin/tickets";
    Ticket.findOneAndRemove({'_id': ticketId}, function(err, result){
        if(err) {
            handleError(url, err, res);
        } else {
            res.send(JSON.stringify({message:"ticket "+ticketId+" deleted"}));
        }
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
//var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongoose = require ("mongoose");

// models
var Message = require('../models/messageSchema');

router.post('/twilio/sms', function(req, res) {
    
    var messageItem = req.body;
    var messageBody = req.body.Body.toLowerCase();
    var messageIsProblem = false;
    
    if(messageBody === 'problem')
    {
        // user reporting a problem
        var responseMessage = "Hi, I'm sorry you are experiencing a problem here at Sparrow can you please explain the problem you are experiencing to me?";
        messageIsProblem = true;
    }
    else if(messageBody === 'comments')
    {
        // user providing comments
        var responseMessage = "Thanks for taking the time to help improve the patient experience here at Sparrow, we really appreciate it.";
    }
    else
    {
        // couldn't find keyword
        var responseMessage = "I'm sorry, I didn't understand that. Please reply with PROBLEM to report a problem, or COMMENTS to provide feedback.";
    }
    
    var message = new Message({
        isProblem: messageIsProblem,
        content: messageItem
    });
    
    message.save(function(err){
        if(err){
            console.log("ERROR saving new message to db");  
        } else {
            console.log("Message inserted into the database");
        }
    });
    
    res.setHeader('Content-Type', 'text/plain');
    res.send("Thanks for helping improve the patient experience here at Sparrow.");
});

module.exports = router;
var express = require('express');
var router = express.Router();
var assert = require('assert');
var mongoose = require('mongoose');
var rollbar = require('rollbar');
var lang = require('../lang/text.json');

// models
var Message = require('../models/messageSchema');
var Chain = require('../models/chainSchema');

router.post('/twilio/sms', function(req, res) {
    
    if(req.body.MessagingServiceSid === req.app.get('MESSAGING_SID'))
    {
        res.setHeader('Content-Type', 'text/plain');

        var messageItem = req.body;
        var messageBody = req.body.Body.toLowerCase();
        
        var message = new Message({
            messageType: messageType,
            content: messageItem
        });

        if(messageBody === 'problem' || messageBody === 'comments')
        {
            // set response message
            var responseMessage = messageBody === 'problem' ? lang.problemResponseText : lang.commentsResponseText;
            var messageType = messageBody === 'problem' ? "Problem" : "Comments";
            

            //check for existing chain within last hour
            Chain.findOne({'sender': messageItem.From, 'type': messageType}, function(err, retChain){
                if(retChain == null) {
                    // no chain found -- save message and create chain
                    message.save(function(err){
                        if(err){
                            // error
                            console.log(err);
                            res.send("Whoops something went wrong, please try again.")
                        } else {
                            var chain = new Chain({
                                sender: messageItem.From,
                                type: messageType,
                                messages: [message]
                            });
                            chain.save(function(err){
                                if(err) {
                                    // error
                                    console.log(err);
                                    res.send("Whoops something went wrong, please try again.")
                                } else {
                                    res.send(responseMessage);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            //check for chain in the last hour and append
            Chain.findOne({'sender': messageItem.From}, function(err, resChain){
                if(resChain == null) {
                    //no existing chain, return dont understand message
                    res.send(lang.keywordMissResponseText);
                } else {
                    //append message to the chain
                    message.save(function(err){
                        if(err) {
                            console.log(err);
                            res.send("Whoops something went wrong, please try again.");
                        } else {
                            resChain.messages.push(message);
                            resChain.save(function(err){
                                console.log(err);
                                res.send("Thanks. We have appended this message to your ticket and we will reach out if we have further questions!");
                            });
                        }
                    });
                }
            });
        }
    } else {
        res.setHeader('Content-Type', 'application/json');
        rollbar.reportMessage("Unrecognized Messaging Service Attempting Request");
        res.status(401);
        res.send(JSON.stringify({message:"Messaging Service SID Not Recognized"}));
    }
});

module.exports = router;
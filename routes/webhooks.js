var express = require('express');
var router = express.Router();
var assert = require('assert');
var mongoose = require('mongoose');
var rollbar = require('rollbar');
var lang = require('../lang/text.json');

// models
var Message = require('../models/message');
var Ticket = require('../models/ticket');

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

            //check for existing ticket within last hour
            Ticket.findOne({sender: messageItem.From, type: messageType, received:{$gte: new Date(Date.now() - 1000 * 60 * 30)}}, function(err, retTicket){
                if(retTicket == null) {
                    // no ticket found -- save message and create ticket
                    message.save(function(err){
                        if(err){
                            // error
                            console.log(err);
                            res.send(lang.genericErrorText)
                        } else {
                            var ticket = new Ticket({
                                sender: messageItem.From,
                                type: messageType,
                                status: "Open",
                                messages: [message]
                            });
                            ticket.save(function(err){
                                if(err) {
                                    // error
                                    console.log(err);
                                    res.send(lang.genericErrorText)
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
            Ticket.findOne({sender: messageItem.From, received:{$gte: new Date(Date.now() - 1000 * 60 * 30)}}, function(err, resTicket){
                if(resTicket == null) {
                    //no existing chain, return dont understand message
                    res.send(lang.keywordMissResponseText);
                } else {
                    //append message to the chain
                    message.save(function(err){
                        if(err) {
                            console.log(err);
                            res.send(lang.genericErrorText);
                        } else {
                            resTicket.messages.push(message);
                            resTicket.save(function(err){
                                if(err) {
                                    console.log(err);
                                    res.send(lang.genericErrorText);
                                } else {
                                    res.send(lang.thanksAppendedText);
                                }
                            });
                        }
                    });
                }
            });
        }
    } else {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        rollbar.reportMessage("Unrecognized Messaging Service from: "+ip);

        res.setHeader('Content-Type', 'application/json');
        res.status(401);
        res.send(JSON.stringify({message:lang.sidNotRecognizedText}));
    }
});

module.exports = router;
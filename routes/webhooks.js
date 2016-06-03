var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var insertMessage = function(message, db, callback) {
    var collection = db.collection('messages');
    
    message.receieved = Date.now();
    message.reviewed = false;
    
    collection.insertOne(message, function(err, result){
        assert.equal(err, null);
        console.log("Inserted message into the messages collection.");
        callback(result);
    });
}

router.post('/twilio/sms', function(req, res) {
    
    var messageItem = req.body;
    
    // add message to mongo (Azure DocumentDB) asynchronously
    MongoClient.connect(req.app.get('MONGO_URI'), function(err, db) {
        assert.equal(null, err);
        console.log("Connected succesfully to server");

        insertMessage(messageItem, db, function(){
            db.close();
        });
    });    
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({message:"yolo baggins"}));
});

module.exports = router;
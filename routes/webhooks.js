var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var getMongoUrl = function(req) {

    if (req.app.get('env') === 'development')
    {
        var sjson = require('../secrets.json');
        return sjson.mongoUri;
    }
    else
    {
        return process.env.MONGO_URI
    }
}

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

var findMessages = function(db, callback) {
    var collection = db.collection('messages');
    
    collection.find({}).toArray(function(err, data) {
        assert.equal(err, null);
        console.log("Found the following messages:");
        console.log(data);
        callback(data);
    });
}

router.post('/twilio/sms', function(req, res) {
    
    var messageItem = req.body;
    var url = getMongoUrl(req);
    
    // add message to mongo (Azure DocumentDB) asynchronously
    MongoClient.connect(url, function(err, db) {
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
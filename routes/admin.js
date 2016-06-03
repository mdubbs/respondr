var express = require('express');
var router = express.Router();
var pjson = require('../package.json');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

var collectionId = "messages";

var getMessages = function(db, callback) {
    var collection = db.collection(collectionId);   
    collection.find({}).toArray(function(err, data) {
        assert.equal(err, null);
        console.log("Found the following messages");
        console.log(data);
        callback(data);
    });
}

var findMessage = function(id, db, callback) {
    var collection = db.collection(collectionId);
    collection.findOne({_id: ObjectID(id)}, function(err, data){
        assert.equal(err, null);
        console.log("Found the following message");
        console.log(data);
        callback(data);
    });
}

router.get('/', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({message: "respondr admin", version: pjson.version}));
});

router.get('/messages', function(req, res){
    MongoClient.connect(req.app.get('MONGO_URI'), function(err, db) {
        assert.equal(null, err);
        console.log("Connected succesfully to server");

        getMessages(db, function(data){
            db.close();
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({url:'/admin/messages', results: data, totalCount: data.length}));
        });
    });   
});

router.get('/messages/:id', function(req, res){
    var messageId = req.params.id;
    MongoClient.connect(req.app.get('MONGO_URI'), function(err, db) {
        assert.equal(null, err);
        console.log("Connected succesfully to server");

        findMessage(messageId, db, function(data){
            db.close();
            res.setHeader('Content-Type', 'application/json');
            data.url = '/admin/messages/'+messageId;
            res.send(JSON.stringify(data));
        });
    });
});

module.exports = router;

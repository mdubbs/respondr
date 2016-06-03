var express = require('express');
var router = express.Router();


router.post('/twilio/sms', function(req, res) {
    console.log(req.body);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({message:"yolo baggins"}));
});

module.exports = router;
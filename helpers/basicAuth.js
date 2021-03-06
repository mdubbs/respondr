var basicAuth = require('basic-auth');

var BasicAuth = function(req, res, next) {
    // grab the user information using the basic-auth library
    var user = basicAuth(req);
    
    // set the username and password to env vars or ones set in the secrets.json file
    // TODO: build out a manageable user system
    if(req.app.get('env') === 'development') {
        var sjson = require('../secrets.json');
        var username = sjson.API_USERNAME;
        var password = sjson.API_PASSWORD;
    } else {
        var username = process.env.API_USERNAME
        var password = process.env.API_PASSWORD
    }
    
    // if no user, or missing username || password reject
    if(!user || !user.name || !user.pass) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.status(401);
        res.send(JSON.stringify({message: "Authorization Required"}));
        return;
    }
    
    // check for match
    if(user.name === username && user.pass === password) {
        // if match continue
        next();
    } else {
        // return authorization requried
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.status(401);
        res.send(JSON.stringify({message: "Authorization Required"}));
        return;
    }
}

module.exports = BasicAuth;
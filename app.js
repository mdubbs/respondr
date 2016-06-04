var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

// helpers
var basicAuth = require('./helpers/basicAuth');

// route files
var routes = require('./routes/index');
var webhooks = require('./routes/webhooks');
var admin = require('./routes/admin');

var app = express();

var env = process.env.NODE_ENV || 'development';

app.set('port', process.env.PORT || 3000);

app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// set mongo (or Azure DocumentDB) URI local variable
if (env === 'development') {
    var sjson = require('./secrets.json');
    app.set('MONGO_URI', sjson.MONGO_URI);
    var mongoUri = sjson.MONGO_URI;
} else {
    app.set('MONGO_URI', process.env.MONGO_URI);
    var mongoUri = process.env.MONGO_URI;
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

mongoose.connect(mongoUri, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to mongo/documentdb' + '. ' + err);
    } else {
        console.log ('SUCCESS connecting to mongo/documentdb');
    }
});


app.use('/', routes);
app.use('/webhooks', webhooks);
app.use('/admin', basicAuth, admin);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: err.message,
        }));
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        message: err.message,
    }));
});


module.exports = app;

var compression = require('compression');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var rollbar = require('rollbar');

var mongoose = require('mongoose');

// helpers
var basicAuth = require('./helpers/basicAuth');

// route files
var routes = require('./routes/index');
var webhooks = require('./routes/webhooks');
var admin = require('./routes/admin');

var app = express();

app.use(compression());

app.use(function (req, res, next) {
  res.contentType('application/json');
  next();
});

var env = process.env.NODE_ENV || 'development';

app.set('port', process.env.PORT || 3000);

app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// setup messaing sid and mongo uri
app.set('MESSAGING_SID', env === 'development' ? require('./secrets.json').MESSAGING_SID : process.env.MESSAGING_SID);
app.set('MONGO_URI', env === 'development' ? require('./secrets.json').MONGO_URI : process.env.MONGO_URI);

// setup Rollbar
if (env === 'development') {
    var sjson = require('./secrets.json');
    app.use(rollbar.errorHandler(sjson.ROLLBAR_TOKEN, {environment: env}));
}
else
    app.use(rollbar.errorHandler(process.env.ROLLBAR_TOKEN, {environment: env}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

mongoose.connect(app.get('MONGO_URI'), function (err, res) {
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
    res.send(JSON.stringify({
        message: "something went wrong",
    }));
});


module.exports = app;

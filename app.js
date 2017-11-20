// Express.js related requires
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// helmet
app.use(helmet());

// parser
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', IndexHandler);

// Catch all 404, too lazy for dedicated view
app.get('*', function(req, res){
    res.redirect('/');
});

// Index Handler
function IndexHandler(req, res){
    res.render('index');
};

module.exports = app;

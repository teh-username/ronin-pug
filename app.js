// Express.js related requires
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// Controller related requires
var storage = require('node-persist');
var validator = require('validator');
var config = require('config');
var reCAPTCHA = require('recaptcha2');
var shortid = require('shortid');
var gmail = require('gmail-send')();

var app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parser
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', IndexHandler);
app.post('/', FormHandler, IndexHandler);

// Catch all 404, too lazy for dedicated view
app.get('*', function(req, res){
    res.redirect('/');
});

// Index Handler
function IndexHandler(req, res){
    var quote = '';
    storage.init().then(function(){
        var quotes = storage.values();
        var quote = quotes[Math.floor(Math.random()*quotes.length)];
        res.render('index', {
            quote: quote,
            isFormValid: req.isFormValid,
            form: req.body
        });
    });
};

// Form Handler
function FormHandler(req, res, next){
    var params = req.body;
    var recaptcha = new reCAPTCHA({
        siteKey: config.get('Google.recaptcha.site-key'),
        secretKey: config.get('Google.recaptcha.secret-key')
    });

    req.isFormValid = true;
    var isMissingAnyDetails = validator.isEmpty(params.name)
        || validator.isEmpty(params.email)
        || validator.isEmpty(params.message);

    var isValidEmail = validator.isEmail(params.email);
    var isWithinCharLimit = validator.isLength(params.name, {min:1, max: 30})
        || validator.isLength(params.email, {min:1, max: 20})
        || validator.isLength(params.message, {min:1, max: 100});

    if(isMissingAnyDetails || !isValidEmail || !isWithinCharLimit){
        console.log('err form');
        req.isFormValid = false;
        next();
    }

    recaptcha.validate(req.body['g-recaptcha-response'])
        .then(function(){
            gmail({
                "user": config.get('Google.mailer.from'),
                "pass": config.get('Google.mailer.password'),
                "to": config.get('Google.mailer.to'),
                "subject": config.get('Google.mailer.subject'),
                "text": `Hi! ${params.name} sent you a message: ${params.message}. Reply at ${params.email}`
            }, function(err, res){
                if(!err){
                    next();
                }
                else{
                    storage.init().then(function(){
                        storage.setItem(shortid.generate(), {
                            name: req.body.name,
                            email: req.body.email,
                            message: req.body.message,
                            timestamp: (+new Date())
                        }).then(function(){
                            next();
                        });
                    });
                }
            });
        })
        .catch(function(errorCodes){
            req.isFormValid = false;
            next();
        });
};

module.exports = app;

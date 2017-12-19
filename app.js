// Express.js related requires
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var fs = require('fs');
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
app.get('/scraper', ScraperHandler);

// Catch all 404, too lazy for dedicated view
app.get('*', function(req, res){
    res.redirect('/');
});

// Index Handler
function IndexHandler(req, res){
    res.render('index');
};

// Scraper Chart
function ScraperHandler(req, res){
  const parser = require('./utils/parser');
  fs.readFile(`${__dirname}/scraped/scraper.log`, 'utf8', function(err, data) {
    if (err) {
      res.render('index');
    }
    else {
      const entries = data.split('\n').map((entry) => entry.split('_'));
      entries.pop();
      const dataset = parser(entries);

      res.render('scraper', {
        labels: JSON.stringify(dataset.labels),
        datasets: JSON.stringify(dataset.datasets)
      });
    }
  });
};

module.exports = app;

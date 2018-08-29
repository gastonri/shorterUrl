'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');
var router = express.Router();


var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


// -------------------------------------------------------
var crearUrl = require('./app.js').crearShortUrl;
app.get('/new/:shorter_url(*)', function (req, resp, next) {
  
  dns.lookup(req.params.shorter_url, function(err) {
    if (!err) {
      crearUrl(req.params.shorter_url, function(err, data) {
        next(resp.json(data));
      });
    }
  });
});
// -------------------------------------------------------

var consultarShort = require('./app.js').consultarShortUrl;
app.get('/shorter/:shorter(*)', function (req, resp, next) {
  
 consultarShort(req.params.shorter, function(err, data) {
    resp.writeHead(301, {Location: data.original_url});
    resp.end();
    next();
   // next(resp.json(data));
 }); 
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});
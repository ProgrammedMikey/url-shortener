'use strict';

var express = require('express');
var mongoose = require('mongoose');
var routes = require('./public/controller/urlController.js');


var app = express();
//
var MONGO_URI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017';
mongoose.connect(MONGO_URI);


app.use('/', express.static(process.cwd() + '/public'));


routes(app);

var port = process.env.PORT || 3000;
var host = process.env.HOST  || "https://mdasilva-urlshortener.herokuapp.com/";
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...'+ host);
});

'use strict';
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();



app.use(cors());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
var controllers = require('./controllers');
controllers.init(app);

var server = http.createServer(app);
server.listen(3000);
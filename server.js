var express = require('express');
var app = express();
var routes = require('./routes');

app.use('/', routes);

var server = app.listen(8081);
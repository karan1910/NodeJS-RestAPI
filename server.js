var express = require('express');
var app = express();
var routes = require('./users-routes');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/users', routes);

var server = app.listen(8081);
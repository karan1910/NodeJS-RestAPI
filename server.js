var express = require('express');
var app = express();
var usersRoutes = require('./users-routes');
var notesRoutes = require('./n&c-routes');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/users', usersRoutes);
app.use('/', notesRoutes);

var server = app.listen(8081);
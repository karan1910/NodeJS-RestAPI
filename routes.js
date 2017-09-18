var express = require('express');
var router = express.Router();
var format = require('string-template');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/users";

router
    .get('/', getUsers)
    .post('/users', createUserMW)
    .post('/users', createUser)
    .put('/users/:userid', updateUser)
    .delete('/users/:userid', deleteUser)
    .get('/notes', getNotes)
    .get('/users/:userid/notes', getUserNote)
    .post('/users/:userid/notes', createUserNote)
    .put('/users/:userid/notes/:noteid', updateUserNote)
    .delete('/users/:userid/notes/:noteid', deleteUserNote)
    .get('/notes/:noteid/comments', getNoteComments)
    .post('/notes/:noteid/comments', createNoteComments)
    .put('/notes/:noteid/comments/:commentid', updateNoteComments)
    .delete('/notes/:noteid/comments/:commentid', deleteNoteUpdate)
    .get('/users/:userid/comments', getUserComments)
    .get('/comments', getComments)
    .get('/users/:userid/notes/:noteid/comments', getUserNoteComments);

function getUsers(req, res){
    MongoClient.connect(url, function(err, db) {
        if (err) {
            next(err);
        } else {
            var responseObject = {};
            responseObject.data = []; 
            db.collection("customers").find({}).toArray(function(err, result) {
                if (err) throw err;
                responseObject.data.push(result);
                res.status(200).send(result);
            });
        }
      });
}

function createUserMW(req, res, next){
    req.dummybody = {};
    req.dummybody.notes = {};
    req.dummybody.attributes = {};
    req.dummybody.attributes.name = null;
    req.dummybody.attributes.email = null;
    next();
}

function createUser(req, res){
    var myobj = req.dummybody;
    myobj._id = req.body.id;
    myobj.attributes.name = req.body.name;
    myobj.attributes.email = req.body.email;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbCall = function(){
            return new Promise(function(resolve, reject){
                db.collection("customers").insertOne(myobj, function(err, result){
                    resolve(myobj);
                });
            });
        };
        dbCall().then(function(result){
            res.status(200).send(myobj);
        }).catch(function(err){
            console.log("Error: " + err);
        });
    });
}
function updateUser(req, res){
    res.send("updateUser");
}
function deleteUser(req, res){
    res.send("deleteUser");
}
function getNotes(req, res){
    res.send("getNotes");
}
function getUserNote(req, res){
    res.send("getUserNotes" + req.params.userid);
}
function createUserNote(req, res){
    
}
function updateUserNote(req, res){
    
}
function deleteUserNote(req, res){
    
}
function getNoteComments(req, res){
    res.send("getNoteComments");
}
function createNoteComments(req, res){
    
}
function updateNoteComments(req, res){
    
}
function deleteNoteUpdate(req, res){
    
}
function getUserComments(req, res){
    
}
function getComments(req, res){
    
}
function getUserNoteComments(req, res){
    
}

module.exports = router;
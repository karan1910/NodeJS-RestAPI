var express = require('express');
var router = express.Router();
var format = require('string-template');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var ObjectID = require('mongodb').ObjectID;
var users = 'users';

MongoClient.connect(url, {
    poolSize: 10
  },
  function(err, db) {
      mongodb = db;
  }
);

router
    .get('/', getUsers)
    .get('/:userid', getUser)
    .post('/', createUser)
    .get('/:userid/notes', getUserNotes)
    .post('/:userid/notes', createUserNote)
    .put('/:userid/notes/:noteid', updateUserNote)
    .delete('/:userid/notes/:noteid', deleteUserNote)
    .get('/:userid/comments', getUserComments)
    .put('/:userid', updateUser)
    .delete('/:userid', deleteUser)
    .get('/users/:userid/notes/:noteid/comments', getUserNoteComments);
    

function getUsers(req, res){
        mongodb.collection(users).find({}).toArray(function(err, result) {
        if (err) throw err;
        res.status(200).send(result);
    });
}

function getUserNoteComments(req, res){
    var userid = req.params.userid;
    var noteid = req.params.noteid;
    mongodb.collection(comments).find({userid : userid, noteid : noteid}).toArray(function(err, result){
        if (err) throw err;
        res.status(200).send(result);
    });
}

function getUserNotes(req, res){
    console.log('getUserNotes');
    var userid = req.params.userid;
    mongodb.collection(notes).find({'userid' : userid}).toArray(function(err, result){
        res.status(200).send(result);
    });
}

function getUserComments(req, res){
    var userid = req.params.userid;
    var commentid = req.params.commentid;
    mongodb.collection(comments).find({userid : userid}).toArray(function(err, result){
        if (err) throw err;
        res.status(200).send(result);
    });
}

function getUser(req, res){
    var id = req.params.userid;
    mongodb.collection(users).find({_id: ObjectID(id)}).toArray(function(err, result) {
        if (err) throw err;
        if(result.length === 0){
            res.status(404).send({"Error" : "Not-Found"});
        }
        else{
            res.status(200).send(result);
        }
    });
}


function createUserNote(req, res){
    console.log('createUserNote');
    var newNote = {};
    newNote.title = req.body.title; 
    newNote.created = Date.now();
    newNote.userid = req.params.userid;
    newNote.content = req.body.content; 
    console.log(newNote);
    mongodb.collection(notes).insertOne(newNote, function(err, result){
        var rel = {};
        console.log(result);
        rel.noteID = newNote._id;
        rel.userID = req.params.userid;
        console.log(rel);
        res.status(200).send(newNote);
        console.log("here aslso");
        mongodb.collection(userNotesRel).insertOne(rel);
    });
}

function updateUserNote(req, res){
    console.log('updateUserNote');
    var newNote = {};
    var userid = req.params.userid;
    var noteid = req.params.noteid;
    newNote.modified = Date.now();
    if(req.body.title){
        newNote.title = req.body.title;
    }
    else if(req.body.content){
        newNote.content = req.body.content;
    }
    mongodb.collection(userNotesRel).find({noteID : noteid, 'userID' : userid}).toArray(function(err, result){
        if(result.length === 0){
            res.status(404).send({'Error' : 'Resource Not Found'});
        }
        else{
            mongodb.collection(notes).updateOne({_id : ObjectID(noteid)}, {$set : newNote});
            res.status(200).send({'Status' : 'in-process'});
        }
    });
}

function deleteUserNote(req, res){
    console.log('deleteUserNote');
    var userid = req.params.userid;
    var noteid = req.params.noteid;
    mongodb.collection(userNotesRel).deleteMany({noteID : noteid, userID : userid});
    mongodb.collection(notes).deleteOne({_id : ObjectID(noteid), userid : userid});
    mongodb.collection(comments).deleteMany({userid : userid, noteid : userid});
    res.status(200).send({'status' : 'in-process'});
}

function createUser(req, res){
    var myobj = {};
    myobj.name = req.body.name;
    myobj.email = req.body.email;
    console.log(req.body);
    mongodb.collection(users).insertOne(myobj, function(err, result){
        res.status(200).send(myobj);
    });
}

function updateUser(req, res){
    var id = req.params.userid;
    mongodb.collection(users).find({_id: ObjectID(id)}).toArray(function(err, result) {
        if (err) throw err;
        if(result.length === 0){
            res.status(404).send({"Error" : "Not-Found"});
        }
        else{
            var updatedItems = {};
            if(req.body.name){
                updatedItems.name = req.body.name;
            }
            else if(req.body.email){
                updatedItems.email = req.body.email;
            }
            mongodb.collection(users).updateOne({_id : ObjectID(id)}, {$set : updatedItems});
            res.status(200).send({"status" : "in-process"});
        }   
    });
}

function deleteUser(req, res){
    var id = req.params.userid;
    console.log(id);
    mongodb.collection(users).deleteOne({_id: ObjectID(id)}, function(){
        res.status(200).send({"status" : "in-process"});
    });
    mongodb.collection('comments').deleteMany({userid: id});
    mongodb.collection('notes').deleteMany({userid: id});
    mongodb.collection('userNotesRel').deleteMany({userID: id});
}

module.exports = router;
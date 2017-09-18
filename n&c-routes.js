var express = require('express');
var router = express.Router();
var format = require('string-template');
var MongoClient = require('mongodb').MongoClient;
var userNotesRel = "userNotesRel";
var comments = 'comments';
var notes = "notes";
var ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, {
    poolSize: 10

  },
  function(err, db) {
      mongodb = db;
  }
);

router
    .get('/notes', getNotes)
    .get('/users/:userid/notes', getUserNotes)
    .post('/users/:userid/notes', createUserNote)
    .put('/users/:userid/notes/:noteid', updateUserNote)
    .delete('/users/:userid/notes/:noteid', deleteUserNote)
    .get('/notes/:noteid/comments', getNoteComments)
    .post('/notes/:noteid/comments', createNoteComments)
    .put('/notes/:noteid/comments/:commentid', updateNoteComments)
    .delete('/notes/:noteid/comments/:commentid', deleteNoteComment)
    .get('/users/:userid/comments', getUserComments)
    .get('/comments', getComments)
    .get('/users/:userid/notes/:noteid/comments', getUserNoteComments);


function getNotes(req, res){
    mongodb.collection(notes).find({}).toArray(function(err, result){
        if (err) throw err;
        console.log('getUsers');
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
    mongodb.collection(userNotesRel).find({'noteID' : noteid, 'userID' : userid}).toArray(function(err, result){
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
    mongodb.collection(userNotesRel).deleteOne({_id : ObjectID(noteid)}, function(err, res){
        mongodb.collection(notes).deleteOne({_id : ObjectID(noteid)}, function(err, res){
            res.status(200).status({'status' : 'in-process'});
        });
    });
}

function getNoteComments(req, res){
    var noteid = req.params.noteid;
    mongodb.collection(comments).find({'noteid' : noteid}).toArray(function(err, result){
        res.status(200).send(result);
    });
}

function createNoteComments(req, res){
    var noteid = req.params.noteid;
    var userid = req.body.userid;
    var newComment = {};
    newComment.userid = userid;
    newComment.created = Date.now();
    newComment.noteid = noteid;
    newComment.content = req.body.content;
    mongodb.collection(comments).insertOne(newComment, function(err, result){
        if(err) throw err;
        res.status(200).send(newComment);
    });
}

function updateNoteComments(req, res){
    var commentid = req.params.commentid;
    var noteid = req.params.noteid;
    var updatedComment = {};
    if(req.body.content){
        updatedComment.content = req.body.content;
    }
    mongodb.collection(comments).updateOne({noteid : noteid, commentid : commentid}, {$set : updatedComment}, function(err, result){
        if(err) throw err;
        res.status(200).send({'status' : 'in-process'});
    });
}

function deleteNoteComment(req, res){
    var commentid = req.params.commentid;
    var noteid = req.params.noteid;
    mongodb.collection(comments).deleteOne({commentid : commentid, noteid : noteid}, function(err, result){
        if(err){
            throw err;
        }
        res.status(200).send({'status' : 'in-process'});
    });
}

function getUserComments(req, res){
    var userid = req.params.userid;
    var commentid = req.params.commentid;
    mongodb.connect(comments).find({userid : userid}).toArray(function(err, result){
        if (err) throw err;
        res.status(200).send(result);
    });
}

function getComments(req, res){
    mongodb.connect(comments).find({}).toArray(function(err, result){
        if (err) throw err;
        res.status(200).send(result);
    });
}

function getUserNoteComments(req, res){
    var userid = req.params.userid;
    var noteid = req.params.noteid;
    mongodb.connect(comments).find({userid : userid, noteid : noteid}).toArray(function(err, result){
        if (err) throw err;
        res.status(200).send(result);
    });
}

module.exports = router;
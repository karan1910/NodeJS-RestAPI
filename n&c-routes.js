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
    .get('', getNotes)
    .get('/:noteid', getNote)
    .get('/:noteid/comments', getNoteComments)
    .post('/:noteid/comments', createNoteComments)
    .put('/:noteid/comments/:commentid', updateNoteComments)
    .delete('/:noteid/comments/:commentid', deleteNoteComment)
    .get('/:noteid/comments/:commentid', getCommentsOnNote);


function getNotes(req, res){
    mongodb.collection(notes).find({}).toArray(function(err, result){
        if (err) throw err;
        console.log('getNotes');
        res.status(200).send(result);
    });
}

function getCommentsOnNote(req, res){
    var commentid = req.params.commentid;
    var noteid = req.params.noteid;
    console.log(commentid);
    console.log(noteid);
    mongodb.collection(comments).find({_id : ObjectID(commentid), noteid : noteid}).toArray(function(err, result){
        res.status(200).send(result);
    });
}

function getNote(req, res){
    console.log("getNote");
    var noteid = req.params.noteid;
    mongodb.collection(notes).find({_id : ObjectID(noteid)}).toArray(function(err, result){
        res.status(200).send(result);
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
    mongodb.collection(comments).updateOne({noteid : noteid, _id : ObjectID(commentid)}, {$set : updatedComment}, function(err, result){
        if(err) throw err;
        res.status(200).send({'status' : 'in-process'});
    });
}

function deleteNoteComment(req, res){
    console.log("deleteNoteComment");
    var commentid = req.params.commentid;
    var noteid = req.params.noteid;
    mongodb.collection(comments).deleteOne({noteid : noteid, _id : ObjectID(commentid)}, function(err, result){
        if(err){
            throw err;
        }
        res.status(200).send({'status' : 'in-process'});
    });
}


module.exports = router;
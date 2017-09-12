var express = require('express');
var router = express.Router();
var format = require('string-template');

router.get('/users', getUsers)
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
    res.send("getUsers");
}
function createUser(req, res){
    res.send("createUser");
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
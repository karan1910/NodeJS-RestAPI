var express = require('express');
var router = express.Router();
var format = require('string-template');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var ObjectID = require('mongodb').ObjectID;

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
    .put('/:userid', updateUser)
    .delete('/:userid', deleteUser);

function getUsers(req, res){
        mongodb.collection("customers").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.status(200).send(result);
    });
}

function getUser(req, res){
    var id = req.params.userid;
    mongodb.collection("customers").find({_id: ObjectID(id)}).toArray(function(err, result) {
        if (err) throw err;
        if(result.length === 0){
            res.status(404).send({"Error" : "Not-Found"});
        }
        else{
            res.status(200).send(result);
        }
    });
}

function createUser(req, res){
    var myobj = {};
    myobj.name = req.body.name;
    myobj.email = req.body.email;
    console.log(req.body);
    mongodb.collection("customers").insertOne(myobj, function(err, result){
        res.status(200).send(myobj);
    });
}

function updateUser(req, res){
    var id = req.params.userid;
    mongodb.collection("customers").find({_id: ObjectID(id)}).toArray(function(err, result) {
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
            mongodb.collection("customers").updateOne({_id : ObjectID(id)}, {$set : updatedItems});
            res.status(200).send({"status" : "in-process"});
        }   
    });
}

function deleteUser(req, res){
    var id = req.params.userid;
    mongodb.collection("customers").deleteOne({_id: ObjectID(id)}, function(){
        res.status(200).send({"status" : "in-process"});
    });
}

module.exports = router;
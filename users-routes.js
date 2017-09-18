var express = require('express');
var router = express.Router();
var format = require('string-template');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var ObjectId = require('mongodb').ObjectID;

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
        res.status(200).send(result);
    });
}

function createUser(req, res){
    var myobj = { attributes: {} };
    myobj.attributes.name = req.body.attributes.name;
    myobj.attributes.email = req.body.attributes.email;
    mongodb.collection("customers").insertOne(myobj, function(err, result){
        res.status(200).send(myobj);
    });
}

function updateUser(req, res){
    var id = req.params.userid;
    mongodb.collection("customers").find({_id: ObjectId(id)}).toArray(function(err, result) {
        if (err) throw err;
        if(result.length === 0){
            res.status(404).send({"Error" : "Not-Found"});
        }
        else{
            var updatedItems = { attributes : {}};
            if(req.body.attributes.name){
                updatedItems.attributes.name = req.body.attributes.name;
            }
            else if(req.body.attributes.email){
                updatedItems.attributes.email = req.body.attributes.email;
            }
            mongodb.collection("customers").updateOne({_id : id}, {$set : updatedItems});
            res.status(200).send({"status" : "in-process"});
        }   
    });
}

function deleteUser(req, res){
    var id = req.params.userid;
    mongodb.collection("customers").find({_id: ObjectID(id)}).toArray(function(err, result) {
        if (err) throw err;
        if(result.length === 0){
            res.status(404).send({"Error" : "Not-Found"});
        }
        else{
            mongodb.collection("customers").deleteOne({_id: ObjectID(id)}, function(){
                res.status(200).send({"status" : "in-process"});
            });
        }
    });
}

module.exports = router;
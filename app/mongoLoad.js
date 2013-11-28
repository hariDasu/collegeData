var require = require('http');

var MongoClient = require('mongodb').MongoClient;

//Connect to the db
MongoClient.connect("mongodb://localhost:27017/collegeData",function (err,db){
    if(!err){
        console.log("We are connected");
    }
});

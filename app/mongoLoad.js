var require = require('http');

var MongoClient = require('mongodb');

var db = new MongoClient.Db('collegeData', new MongoClient.server('localhost', 27017, {}), {});


//Connect to the db
db.open(function(){});

db.open(function(err, client){
    client.createCollection("colleges", function(err, col) {
        client.collection("colleges", function(err, col) {
            for (var i = 0; i < 100; i++) {
                col.insert({c:i}, function() {});
            }
        });
    });
});


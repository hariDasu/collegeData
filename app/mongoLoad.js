var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;
    console.log("Connected to mongo!");

    //simple json doc
    var document = {school:"NJIT", location: "NJ"};
    db.collection('test').remove();
    Console.log("cleared test!");

    //insert doc
    db.collection('test').insert(document, function(err, docs) {
        if (err) throw err;
        console.log("doc added as " + docs[0]._id);
          });

});

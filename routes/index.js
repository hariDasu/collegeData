
/*
 * GET home page.
 */

//var mongo = require('mongodb');
var _ = require('underscore');
// var monk = require('monk');
// var db = monk('localhost:27017/collegeDB');

// var collegeDB=null ;

/*
mongo.MongoClient.connect( 'mongodb://localhost:27017/collegeDB', function (err, db) {
    if (err)  return console.dir(err)
    collegeDB=db
});
*/

exports.index = function(req, res){
  res.render('index', { title: 'CollegeDB' });
};



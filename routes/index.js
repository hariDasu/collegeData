
/*
 * GET home page.
 */

var mongo = require('mongodb');
// var monk = require('monk');
// var db = monk('localhost:27017/collegeDB');

var collegeDB=null ;
mongo.MongoClient.connect( 'mongodb://localhost:27017/collegeDB', function (err, db) {
    if (err)  return console.dir(err)
    collegeDB=db
});
exports.index = function(req, res){
  res.render('index', { title: 'CollegeDB' });
};

exports.univs = function() {
    return function(req, res) {
        var opts1 = {limit:20,sort:{EFYTOTLT:-1}};
        var flds1 = {UNITID:1,EFYTOTLT:1};
        coll = collegeDB.collection("univs")
        coll.find( {rowType: "ENR"}, flds1, opts1).toArray(
            function (err, docs) {

                console.log(docs);
                res.render('univs',{"univs":docs});
            }
        );


    };
};

exports.univTest = function() {
    return function(req, res) {
       coll = collegeDB.collection("univs")
       /*coll.find( {rowType: "ENR"}, {UNITID: 1, EFYTOTL:1}, function (err, results) {
           console.log (results)
       })*/
        var univTest =[
            {UNITID: 1,INSTNM:"NJIT",EFYTOTLT:12},
            {UNITID: 1,INSTNM:"NJIT",EFYTOTLT:12},
            {UNITID: 1,INSTNM:"NJIT",EFYTOTLT:12}
        ]
        res.render('univs',{"univs":univTest});
    };
};



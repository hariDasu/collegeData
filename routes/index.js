
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

exports.question1 = function() {
    function compare(a,b) {
        if (a.EFYTOTLT > b.EFYTOTLT)
            return -1;
        if (a.EFYTOTLT < b.EFYTOTLT)
            return 1;
        return 0;
    }
    return function(req, res) {
        var opts1 = {limit:20,sort:{EFYTOTLT:-1}};
        var flds1 = {UNITID:1,EFYTOTLT:1};
        var flds2 = {INSTNM:1};
        var results = [];
        coll = collegeDB.collection("univs")
        coll.find( {rowType: "ENR"}, flds1, opts1).toArray(
            function (err, docs) {
                docs.forEach(function(oneDoc){
                    //console.log(oneDoc.EFYTOTLT);
                    coll.find({rowType:"GEN",UNITID:oneDoc.UNITID},flds2).toArray(
                        function(err,doc){
                            if (err) console.log(err);
                            var univName = doc[0].INSTNM;
                            var oneResult = {UNITID:oneDoc.UNITID, EFYTOTLT:oneDoc.EFYTOTLT, INSTNM:univName};
                            //console.log(results);
                            results.push(oneResult);
                            if(results.length==20){
                                results.sort(compare);
                                //console.log(results);
                                res.render('question1',{"question1":results});
                            }
                        }
                    )
                })
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



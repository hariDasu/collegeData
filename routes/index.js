
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
        var opts1 = {limit:1000,sort:{EFYTOTLT:-1}};
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

exports.question2 = function() {
    function compare(a,b) {
        if (a.F1A13 > b.F1A13)
            return -1;
        if (a.F1A13 < b.F1A13)
            return 1;
        return 0;
    }
    return function(req, res) {
        var opts1 = {sort:{F1A13:-1}};
        var flds1 = {UNITID:1,F1A13:1};
        var flds2 = {INSTNM:1};
        var results = [];
        coll = collegeDB.collection("univs")
        coll.find( {rowType:"FIN"}, flds1, opts1).toArray(
            function (err, docs) {
                docs.forEach(function(oneDoc){
                    console.log(oneDoc._id,oneDoc.F1A13);
                    if(oneDoc.F1A13!=""){
                        coll.find({rowType:"GEN",UNITID:oneDoc.UNITID},flds2).toArray(
                            function(err,doc){
                                if (err) console.log(err);
                                var univName = doc[0].INSTNM;
                                var oneResult = {UNITID:oneDoc.UNITID, F1A13:oneDoc.F1A13, INSTNM:univName};
                                //console.log(results);
                                results.push(oneResult);
                                if(results.length==20){
                                    results.sort(compare);
                                    //console.log(results);
                                    res.render('question2',{"question2":results});
                                }
                            }
                        )
                    }

                })
                console.log(results.length)
            }
        );


    };
};

exports.question3 = function() {
    function compare(a,b) {
        if (a.F1A18 > b.F1A18)
            return -1;
        if (a.F1A18 < b.F1A18)
            return 1;
        return 0;
    }
    return function(req, res) {
        var opts1 = {sort:{F1A18:-1}};
        var flds1 = {UNITID:1,F1A18:1};
        var flds2 = {INSTNM:1};
        var results = [];
        coll = collegeDB.collection("univs")
        coll.find( {rowType:"FIN"}, flds1, opts1).toArray(
            function (err, docs) {
                docs.forEach(function(oneDoc){
                    console.log(oneDoc._id,oneDoc.F1A18);
                    if(oneDoc.F1A18!=""){
                        coll.find({rowType:"GEN",UNITID:oneDoc.UNITID},flds2).toArray(
                            function(err,doc){
                                if (err) console.log(err);
                                var univName = doc[0].INSTNM;
                                var oneResult = {UNITID:oneDoc.UNITID, F1A18:oneDoc.F1A18, INSTNM:univName};
                                //console.log(results);
                                results.push(oneResult);
                                if(results.length==20){
                                    results.sort(compare);
                                    //console.log(results);
                                    res.render('question3',{"question3":results});
                                }
                            }
                        )
                    }

                })
            }
        );


    };
};

exports.question4 = function() {
    function compare(a,b) {
        if (a.F1D01 > b.F1D01)
            return -1;
        if (a.F1D01 < b.F1D01)
            return 1;
        return 0;
    }
    return function(req, res) {
        var opts1 = {sort:{F1D01:-1}};
        var flds1 = {UNITID:1,F1D01:1};
        var flds2 = {INSTNM:1};
        var results = [];
        coll = collegeDB.collection("univs")
        coll.find( {rowType:"FIN"}, flds1, opts1).toArray(
            function (err, docs) {
                docs.forEach(function(oneDoc){
                    console.log(oneDoc._id,oneDoc.F1D01);
                    if(oneDoc.F1D01!=""){
                        coll.find({rowType:"GEN",UNITID:oneDoc.UNITID},flds2).toArray(
                            function(err,doc){
                                if (err) console.log(err);
                                var univName = doc[0].INSTNM;
                                var oneResult = {UNITID:oneDoc.UNITID, F1D01:oneDoc.F1D01, INSTNM:univName};
                                //console.log(results);
                                results.push(oneResult);
                                if(results.length==20){
                                    results.sort(compare);
                                    //console.log(results);
                                    res.render('question4',{"question4":results});
                                }
                            }
                        )
                    }

                })
            }
        );


    };
};

/*exports.question5 = function() {
    function compare(a,b) {
        if (a.F1D01 > b.F1D01)
            return -1;
        if (a.F1D01 < b.F1D01)
            return 1;
        return 0;
    }
    return function(req, res) {
        var opts1 = {sort:{F1D01:-1}};
        var flds1 = {UNITID:1,F1D01:1};
        var flds2 = {INSTNM:1};
        var results = [];
        coll = collegeDB.collection("univs")
        coll.find( {rowType:"FIN"}, flds1, opts1).toArray(
            function (err, docs) {
                docs.forEach(function(oneDoc){
                    console.log(oneDoc._id,oneDoc.F1D01);
                    if(oneDoc.F1D01!=""){
                        coll.find({rowType:"GEN",UNITID:oneDoc.UNITID},flds2).toArray(
                            function(err,doc){
                                if (err) console.log(err);
                                var univName = doc[0].INSTNM;
                                var oneResult = {UNITID:oneDoc.UNITID, F1D01:oneDoc.F1D01, INSTNM:univName};
                                //console.log(results);
                                results.push(oneResult);

                                if(results.length==20){
                                    results.sort(compare);
                                    //console.log(results);
                                    res.render('question4',{"question4":results});
                                }
                            }
                        )
                    }

                })
            }
        );


    };
};*/

exports.question10 = function() {

    return function(req, res) {
        var opts1 = {limit:1000,sort:{INSTNM:-1}};
        var flds1 = {UNITID:1,STABBR:1,INSTNM:1};
        var lookup = req.param('stateAbbr') || "MO";
        coll = collegeDB.collection("univs")
        coll.find({rowType:"GEN",STABBR:lookup},flds1,opts1).toArray(
            function(err,doc){
                if (err) console.log(err);
                res.render('question10',{"question10":doc})

            });
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



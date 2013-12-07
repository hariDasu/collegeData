/*
 *  This is group1 -
 */


exports.question1 = function(collegeDB) {
    function compareQ1(a,b) {
        if (a.EFYTOTLT > b.EFYTOTLT)
            return -1;
        if (a.EFYTOTLT < b.EFYTOTLT)
            return 1;
        return 0;
    }

    var results = [];
    //-----------------------------------
    function showFinal() {
        results.sort(compare);
        // console.log(results);
        res.render('question1',{"question1":results});
    }
    //-----------------------------------
    function joinEnrollWithInstName(enrDocs, rowYear ) {
        var enrollLookup={}   // key=UNITID  value=maxEnro
        var rcnt=0 , skip=0
        enrDocs.forEach(function(enrDoc){
            console.log(enrDoc)
            enrollLookup[enrDoc._id]=[enrDoc.max]    // store the Enrollment for UNITID
            collGen.find({UNITID:enrDoc._id},flds2).toArray(
                function(err,genDoc){
                    if (err) console.log(err);
                    if (genDoc.length )  {
                        var univName = genDoc[0].INSTNM;
                        var enrollTotal=enrollLookup[genDoc[0].UNITID][0]
                        var rowYear=enrollLookup[genDoc[0].UNITID][1]
                        var oneResult = {UNITID:genDoc[0].UNITID, YEAR:rowYear, EFYTOTLT:enrollTotal, INSTNM:univName};
                        results.push(oneResult);
                        rcnt++
                    } else {
                        // console.log (genDoc)
                        skip++ ;
                    }
                    if (rcnt+skip == enrDocs.length) {
                    }
                }
            )
        })
    }

    return function(req, res) {
        var opts1 = {limit:1000,sort:{EFYTOTLT:-1}};
        var flds1 = {UNITID:1,EFYTOTLT:1,rowYear:1};
        var flds2 = {UNITID:1,INSTNM:1};
        /*
        collEnr10 = collegeDB.collection("ENR10")
        collEnr11 = collegeDB.collection("ENR11")
        */
        collEnr = collegeDB.collection("ENR")
        collGen = collegeDB.collection("GEN")
        year=i+2010
        console.log ("Q1: Fetching from ENR ")
        collEnr11.aggregate (
           [
              { $group:  { _id: "$UNITID", max: { $max: "$EFYTOTLT"} } },
              // { $project: { max:1, rowYear:1 } }
           ], function (err, enrDocs) {
                console.log("Q1: Got " + enrDocs.length + " rows" + "for year=" + year )
                joinEnrollWithInstNames(enrDocs, year)
            }
        )
    }
};

//-------------------------------------------------
exports.question2 = function(collegeDB) {
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




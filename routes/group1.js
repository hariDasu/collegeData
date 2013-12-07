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

    var q1FinalResult=[]
    var q1EnrollBySchool={}
    //-----------------------------------
    function showFinalResults(res) {
        // console.log(results);
        q1FinalResult.sort(compareQ1)
        console.log (q1FinalResult)
        res.render('question1',{"question1":q1FinalResult});
    }
    //-----------------------------------
    function joinEnrollWithInstNames(enrDocs, res) {
        var rcnt=0 , skip=0
        q1EnrollBySchool={}
        q1FinalResult=[]
        enrDocs.slice(0,30).forEach(function(enrDoc){
            q1EnrollBySchool[enrDoc.UNITID]={ EFYTOTLT: enrDoc.EFYTOTLT, rowYear: enrDoc.rowYear }
            collGen.find({UNITID:enrDoc.UNITID},{UNITID:1, INSTNM:1}).toArray(
                function(err,genDoc){
                    if (err) console.log(err);
                    if (genDoc.length )  {
                        curUnitId=genDoc[0].UNITID
                        oneResult={
                           UNITID:  curUnitId,
                           YEAR: q1EnrollBySchool[curUnitId]['rowYear'],
                           EFYTOTLT: q1EnrollBySchool[curUnitId]['EFYTOTLT'],
                           INSTNM: genDoc[0].INSTNM
                        }
                        q1FinalResult.push(oneResult)
                        rcnt++
                    } else {
                        // console.log (genDoc)
                        skip++ ;
                    }
                    if (rcnt  == 30 ) {
                        showFinalResults(res)
                    }
                }
            )
        })
    }

    return function(req, res) {
        var project1 = {UNITID:1,EFYTOTLT:1,rowYear:1 } ;
        var project2 = {UNITID:1,INSTNM:1};
        /*
        collEnr10 = collegeDB.collection("ENR10")
        collEnr11 = collegeDB.collection("ENR11")
        */
        collEnr = collegeDB.collection("ENR")
        collGen = collegeDB.collection("GEN")
        enrQuery={LSTUDY:999}
        console.log ("Q1: Fetching from ENR ")
        collEnr.find ( enrQuery, project1) .toArray(
            function (err, enrDocs) {
                console.log("Q1: Got " + enrDocs.length + " rows" )
                enrDocs.sort(compareQ1);
                joinEnrollWithInstNames(enrDocs, res)
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



exports.question3 = function(collegeDB) {
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

exports.question4 = function(collegeDB) {
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
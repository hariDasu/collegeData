/*
 *  This is group1 -
 */

var _=require("underscore")

//ranked by student enrollment (descending)
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
            if (q1EnrollBySchool[enrDoc.UNITID] == undefined ) {
                q1EnrollBySchool[enrDoc.UNITID]=[ { UNITID:enrDoc.UNITID,EFYTOTLT: enrDoc.EFYTOTLT, YEAR: enrDoc.rowYear } ] 
            } else {
                q1EnrollBySchool[enrDoc.UNITID].push({UNITID:enrDoc.UNITID, EFYTOTLT: enrDoc.EFYTOTLT, YEAR: enrDoc.rowYear })
            }
            collGen.find({UNITID:enrDoc.UNITID},{UNITID:1, INSTNM:1}).toArray(
                function(err,genDoc){
                    if (err) console.log(err);
                    if (genDoc.length )  {
                        curUnitId=genDoc[0].UNITID
                        q1EnrollBySchool[curUnitId].forEach(
                            function (schoolEntry) {
                                 schoolEntry['INSTNM']=genDoc[0].INSTNM
                            }
                        )
                        rcnt++
                    } else {
                        // console.log (genDoc)
                        skip++ ;
                    }
                    if (rcnt  == 30 ) {
                        for (oneSchool in q1EnrollBySchool) {
                            q1EnrollBySchool[oneSchool].forEach(function (oneRes) {
                                q1FinalResult.push(oneRes)
                            } )
                        }
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

//Ranked by total liabilities (descending)
exports.question2 = function(collegeDB) {
    function compareQ2(a,b) {
        if (a.F1A13 > b.F1A13)
            return -1;
        if (a.F1A13 < b.F1A13)
            return 1;
        return 0;
    }

    var q2FinalResult=[]
    var q2LiabsBySchool={}
    //-----------------------------------
    function showFinalResults(res) {
        // console.log(results);
        q2FinalResult.sort(compareQ2)
        console.log (q2FinalResult)
        res.render('question2',{"question2":q2FinalResult});
    }
    //-----------------------------------
    function joinFinWithInstNames(finDocs, res) {
        var rcnt=0 , skip=0
        q2LiabsBySchool={}
        q2FinalResult=[]
        finDocs.slice(0,30).forEach(function(finDoc){
            if (q2LiabsBySchool[finDoc.UNITID] == undefined ) {
                q2LiabsBySchool[finDoc.UNITID]=[ { UNITID:finDoc.UNITID,F1A13: finDoc.F1A13, YEAR: finDoc.rowYear } ]
            } else {
                q2LiabsBySchool[finDoc.UNITID].push({UNITID:finDoc.UNITID, F1A13: finDoc.F1A13, YEAR: finDoc.rowYear })
            }
            collGen.find({UNITID:finDoc.UNITID},{UNITID:1, INSTNM:1}).toArray(
                function(err,genDoc){
                    if (err) console.log(err);
                    if (genDoc.length )  {
                        curUnitId=genDoc[0].UNITID
                        q2LiabsBySchool[curUnitId].forEach(
                            function (schoolEntry) {
                                schoolEntry['INSTNM']=genDoc[0].INSTNM
                            }
                        )
                        rcnt++
                    } else {
                        // console.log (genDoc)
                        skip++ ;
                    }
                    if (rcnt  == 30 ) {
                        for (oneSchool in q2LiabsBySchool) {
                            q2LiabsBySchool[oneSchool].forEach(function (oneRes) {
                                q2FinalResult.push(oneRes)
                            } )
                        }
                        showFinalResults(res)
                    }
                }
            )
        })
    }

    return function(req, res) {
        var project1 = {UNITID:1,F1A13:1,rowYear:1} ;
        var project2 = {UNITID:1,INSTNM:1};
        /*
         collEnr10 = collegeDB.collection("ENR10")
         collEnr11 = collegeDB.collection("ENR11")
         */
        collFin = collegeDB.collection("FIN")
        collGen = collegeDB.collection("GEN")
        //enrQuery={LSTUDY:999}
        collFin.find({}, project1) .toArray(
            function (err, finDocs) {
                console.log("Q2: Got " + finDocs.length + " rows" )
                finDocs.sort(compareQ2);
                joinFinWithInstNames(finDocs, res)
            }
        )
    }
};

//Ranked by net assets (descending)
exports.question3 = function(collegeDB) {
    function compareQ3(a,b) {
        if (a.F1A18 > b.F1A18)
            return -1;
        if (a.F1A18 < b.F1A18)
            return 1;
        return 0;
    }

    var q3FinalResult=[]
    var q3AssetsBySchool={}
    //-----------------------------------
    function showFinalResults(res) {
        // console.log(results);
        q3FinalResult.sort(compareQ3)
        console.log (q3FinalResult)
        res.render('question3',{"question3":q3FinalResult});
    }
    //-----------------------------------
    function joinFinWithInstNames(finDocs, res) {
        var rcnt=0 , skip=0
        q3AssetsBySchool={}
        q3FinalResult=[]
        finDocs.slice(0,30).forEach(function(finDoc){
            if (q3AssetsBySchool[finDoc.UNITID] == undefined ) {
                q3AssetsBySchool[finDoc.UNITID]=[ { UNITID:finDoc.UNITID,F1A18: finDoc.F1A18, YEAR: finDoc.rowYear } ]
            } else {
                q3AssetsBySchool[finDoc.UNITID].push({UNITID:finDoc.UNITID, F1A18: finDoc.F1A18, YEAR: finDoc.rowYear })
            }
            collGen.find({UNITID:finDoc.UNITID},{UNITID:1, INSTNM:1}).toArray(
                function(err,genDoc){
                    if (err) console.log(err);
                    if (genDoc.length )  {
                        curUnitId=genDoc[0].UNITID
                        q3AssetsBySchool[curUnitId].forEach(
                            function (schoolEntry) {
                                schoolEntry['INSTNM']=genDoc[0].INSTNM
                            }
                        )
                        rcnt++
                    } else {
                        // console.log (genDoc)
                        skip++ ;
                    }
                    if (rcnt  == 30 ) {
                        for (oneSchool in q3AssetsBySchool) {
                            q3AssetsBySchool[oneSchool].forEach(function (oneRes) {
                                q3FinalResult.push(oneRes)
                            } )
                        }
                        showFinalResults(res)
                    }
                }
            )
        })
    }

    return function(req, res) {
        var project1 = {UNITID:1,F1A18:1,rowYear:1} ;
        var project2 = {UNITID:1,INSTNM:1};
        /*
         collEnr10 = collegeDB.collection("ENR10")
         collEnr11 = collegeDB.collection("ENR11")
         */
        collFin = collegeDB.collection("FIN")
        collGen = collegeDB.collection("GEN")
        //enrQuery={LSTUDY:999}
        collFin.find({}, project1) .toArray(
            function (err, finDocs) {
                console.log("Q3: Got " + finDocs.length + " rows" )
                finDocs.sort(compareQ3);
                joinFinWithInstNames(finDocs, res)
            }
        )
    }
};

//Ranked by net assets (descending)
exports.question4 = function(collegeDB) {
    function compareQ3(a,b) {
        if (a.F1A18 > b.F1A18)
            return -1;
        if (a.F1A18 < b.F1A18)
            return 1;
        return 0;
    }

    var q3FinalResult=[]
    var q3AssetsBySchool={}
    //-----------------------------------
    function showFinalResults(res) {
        // console.log(results);
        q3FinalResult.sort(compareQ3)
        console.log (q3FinalResult)
        res.render('question4',{"question4":q3FinalResult});
    }
    //-----------------------------------
    function joinFinWithInstNames(finDocs, res) {
        var rcnt=0 , skip=0
        q3AssetsBySchool={}
        q3FinalResult=[]
        finDocs.slice(0,30).forEach(function(finDoc){
            if (q3AssetsBySchool[finDoc.UNITID] == undefined ) {
                q3AssetsBySchool[finDoc.UNITID]=[ { UNITID:finDoc.UNITID,F1A18: finDoc.F1A18, YEAR: finDoc.rowYear } ]
            } else {
                q3AssetsBySchool[finDoc.UNITID].push({UNITID:finDoc.UNITID, F1A18: finDoc.F1A18, YEAR: finDoc.rowYear })
            }
            collGen.find({UNITID:finDoc.UNITID},{UNITID:1, INSTNM:1}).toArray(
                function(err,genDoc){
                    if (err) console.log(err);
                    if (genDoc.length )  {
                        curUnitId=genDoc[0].UNITID
                        q3AssetsBySchool[curUnitId].forEach(
                            function (schoolEntry) {
                                schoolEntry['INSTNM']=genDoc[0].INSTNM
                            }
                        )
                        rcnt++
                    } else {
                        // console.log (genDoc)
                        skip++ ;
                    }
                    if (rcnt  == 30 ) {
                        for (oneSchool in q3AssetsBySchool) {
                            q3AssetsBySchool[oneSchool].forEach(function (oneRes) {
                                q3FinalResult.push(oneRes)
                            } )
                        }
                        showFinalResults(res)
                    }
                }
            )
        })
    }

    return function(req, res) {
        var project1 = {UNITID:1,F1A18:1,rowYear:1} ;
        var project2 = {UNITID:1,INSTNM:1};
        /*
         collEnr10 = collegeDB.collection("ENR10")
         collEnr11 = collegeDB.collection("ENR11")
         */
        collFin = collegeDB.collection("FIN")
        collGen = collegeDB.collection("GEN")
        //enrQuery={LSTUDY:999}
        collFin.find({}, project1) .toArray(
            function (err, finDocs) {
                console.log("Q4: Got " + finDocs.length + " rows" )
                finDocs.sort(compareQ3);
                joinFinWithInstNames(finDocs, res)
            }
        )
    }
};

//-------------------------------------------------
/*
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

*/
/*
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
*/
//Ranked by total revenues (descending)
exports.question5 = function(collegeDB) {
    function compareQ5(a,b) {
        if (a.F1D01 > b.F1D01)
            return -1;
        if (a.F1D01 < b.F1D01)
            return 1;
        return 0;
    }

    var q5FinalResult=[]
    var q5RevsBySchool={}
    //-----------------------------------
    function showFinalResults(res) {
        // console.log(results);
        q5FinalResult.sort(compareQ5)
        console.log (q5FinalResult)
        res.render('question5',{"question5":q5FinalResult});
    }
    //-----------------------------------
    function joinFinWithInstNames(finDocs, res) {
        var rcnt=0 , skip=0
        q5RevsBySchool={}
        q5FinalResult=[]
        finDocs.slice(0,30).forEach(function(finDoc){
            if (q5RevsBySchool[finDoc.UNITID] == undefined ) {
                q5RevsBySchool[finDoc.UNITID]=[ { UNITID:finDoc.UNITID,F1D01: finDoc.F1D01, YEAR: finDoc.rowYear } ]
            } else {
                q5RevsBySchool[finDoc.UNITID].push({UNITID:finDoc.UNITID, F1D01: finDoc.F1D01, YEAR: finDoc.rowYear })
            }
            collGen.find({UNITID:finDoc.UNITID},{UNITID:1, INSTNM:1}).toArray(
                function(err,genDoc){
                    if (err) console.log(err);
                    if (genDoc.length )  {
                        curUnitId=genDoc[0].UNITID
                        q3AssetsBySchool[curUnitId].forEach(
                            function (schoolEntry) {
                                schoolEntry['INSTNM']=genDoc[0].INSTNM
                            }
                        )
                        rcnt++
                    } else {
                        // console.log (genDoc)
                        skip++ ;
                    }
                    if (rcnt  == 30 ) {
                        for (oneSchool in q5RevsBySchool) {
                            q5RevsBySchool[oneSchool].forEach(function (oneRes) {
                                q5FinalResult.push(oneRes)
                            } )
                        }
                        showFinalResults(res)
                    }
                }
            )
        })
    }

    return function(req, res) {
        var project1 = {UNITID:1,F1D01:1,rowYear:1} ;
        var project2 = {UNITID:1,INSTNM:1};
        /*
         collEnr10 = collegeDB.collection("ENR10")
         collEnr11 = collegeDB.collection("ENR11")
         */
        collFin = collegeDB.collection("FIN")
        collGen = collegeDB.collection("GEN")
        //enrQuery={LSTUDY:999}
        collFin.find({}, project1) .toArray(
            function (err, finDocs) {
                console.log("Q5: Got " + finDocs.length + " rows" )
                finDocs.sort(compareQ5);
                joinFinWithInstNames(finDocs, res)
            }
        )
    }
};
/*
exports.question5 = function(collegeDB) {
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
                                    res.render('question5',{"question5":results});
                                }
                            }
                        )
                    }

                })
            }
        );


    };
};
*/
var _ = require("underscore");
var q6StatsBySchoolYear={}    // key=UNITID_rowYear  val={ UNITID:x, statValue:x, instName:x, rowYear:x}
var q6FinalResults=[]

statPicker= {
   "revenue" :  { 
       "projector" : {UNITID:1, F1D01:1, rowYear:1},
       "xtractor" : function(doc) { return doc["F1D01"] },
       "renderer" : "question6"
   },
   "assets" :  { 
       "projector" : {UNITID:1, F1A18:1, rowYear:1},
       "xtractor": function(doc) { return doc.F1A18 },
       "renderer" : "question7"
   },
   "liabs" :  { 
       "projector" : {UNITID:1, F1A13:1, rowYear:1},
       "xtractor": function(doc) { return doc.F1A13 },
       "renderer" : "question8"
   }
}

function compare6(a,b) {
    if (q6StatsBySchoolYear[a]["STAT_PER_STUD"] > q6StatsBySchoolYear[b]["STAT_PER_STUD"])
        return -1;
    if (q6StatsBySchoolYear[a]["STAT_PER_STUD"] < q6StatsBySchoolYear[b]["STAT_PER_STUD"])
        return 1;
    return 0;
}

/*
    [
        {
            UNITID: unitid,
            YEAR : year,
            INSTNM: "TBD"
            STAT:  stat,
            STUDS: students,
            STAT_PER_STUD: statPerStud
        },
        ....
    ]
*/
function showFinalResults(sortedIds,action,res){
    var finalResult=[]
    for (i=0; i<20; i++ ) {
        var curSchoolYear=sortedIds[i]
        q6FinalResults.push(q6StatsBySchoolYear[curSchoolYear])
    }
    console.log(q6FinalResults)
    jadeKey=statPicker[action]["renderer"]
    res.render(jadeKey, {"finalResults": q6FinalResults});
}

// finds UNIV names for top 30 stats only
// it uses the data provided in q6StatsBySchoolYear 
function joinStatsWithInstName(res,action, collegeDB) {
    schoolYearKeys = Object.keys(q6StatsBySchoolYear);
    sortedSchoolYearKeys = schoolYearKeys.sort(compare6)
    retCnt=0
    collGEN=collegeDB.collection("GEN")
    // console.log("SortedIds=" + sortedSchoolYearKeys)
    for(i=0;i<20;i++) {
        curUnitId=sortedSchoolYearKeys[i].split("_")[0]
        console.log ( "Looking up [" + curUnitId + "]")
        collGEN.find({UNITID:parseInt(curUnitId)},{UNITID:1,INSTNM:1}).toArray(
            function (err, genDocs) {
                console.log(genDocs)
                if ( genDocs.length ) {
                    runitId=genDocs[0].UNITID
                    key1=runitId+"_"+"2010"
                    key2=runitId+"_"+"2011"
                    try {
                        q6StatsBySchoolYear[key1]["INSTNM"]=genDocs[0].INSTNM
                        q6StatsBySchoolYear[key2]["INSTNM"]=genDocs[0].INSTNM
                    } catch (err) {
                    }
                    retCnt++
                    if (retCnt == 20) {
                        showFinalResults(sortedSchoolYearKeys,action, res)
                    }
                } else {
                    retCnt++
                    if (retCnt == 20) {
                        showFinalResults(sortedSchoolYearKeys,action,res)
                    }
                }
            }
        )
    }
}



function group1Stat( collegeDB, action) {
    return function(req, res) {
        collENR = collegeDB.collection("ENR")   // enrollments
        collFIN= collegeDB.collection("FIN")   // financials
        //console.log(collENR);
        // first we check enrollment aggregates per each school (UNITID)

        console.log ("Fetching ENRollments ..")
        collENR.find ( {LSTUDY:999}, {UNITID:1,EFYTOTLT:1,rowYear:1} ).toArray(
           function (err, enrDocs) {
                console.log("Fetched " + enrDocs.length + " records");
                var skipped=0;
                var rcnt=0 ;      // count of processed records
                var projector=statPicker[action]["projector"]
                var xtractor=statPicker[action]["xtractor"]
                console.log ("Now fetching Financials ..")
                enrDocs.forEach( function(enrDoc){
                    //console.log(doc._id);
                    // now we find the Revenue for the school (key=UNITID)
                    //collFIN.find({UNITID:enrDoc.UNITID, rowYear:enrDoc.rowYear},{UNITID:1, F1D01:1, rowYear:1}).toArray(
                    //collFIN.find({UNITID:enrDoc.UNITID, rowYear:enrDoc.rowYear},{UNITID:1, F1A18:1, rowYear:1}).toArray(
                    //collFIN.find({UNITID:enrDoc.UNITID, rowYear:enrDoc.rowYear},{UNITID:1, F1A13:1, rowYear:1}).toArray(
                    collFIN.find({UNITID:enrDoc.UNITID,rowYear:enrDoc.rowYear},projector).toArray(
                        function(err,finDocs){
                            // console.log(finDocs)
                            if (finDocs.length) {
                                var unitid = finDocs[0].UNITID
                                var year = finDocs[0].rowYear
                                //var stat = finDocs[0].F1D01;    //  stat is revenue for Q6
                                //var stat = finDocs[0].F1A18;    //  stat is revenue for Q7
                                //var stat = finDocs[0].F1A13;    //  stat is revenue for Q8
                                var stat=xtractor(finDocs[0])
                                var students = enrDoc.EFYTOTLT;
                                var statPerStud = Math.round(stat/students*100)/100;   // stat per student
                                if (stat != "" ) {
                                    var oneResult={
                                        UNITID: unitid,
                                        YEAR : year,
                                        INSTNM: "TBD",
                                        STAT:  stat,
                                        STUDS: students,
                                        STAT_PER_STUD: statPerStud,
                                    }
                                    q6StatsBySchoolYear[unitid+"_" +year]=oneResult
                                    rcnt=_.size(q6StatsBySchoolYear) + skipped
                                    if (rcnt == enrDocs.length ) {
                                       joinStatsWithInstName(res, action, collegeDB)
                                    }
                                } else {
                                    skipped++
                                    rcnt=_.size(q6StatsBySchoolYear) + skipped
                                    if (rcnt == enrDocs.length ) {
                                        joinStatsWithInstName(res, action, collegeDB)
                                    }
                                }
                            } else {
                                skipped++
                                rcnt=_.size(q6StatsBySchoolYear) + skipped
                                if (rcnt == enrDocs.length ) {
                                    joinStatsWithInstName(res, action, collegeDB)
                                }
                            }
                            if ( enrDocs.length - rcnt > 20 ) {
                                if ( (rcnt % 1000) == 0 ) {
                                    console.log ("processed " + rcnt)
                                }
                            } else {
                                console.log ("processed " + rcnt)
                            }
                        }  // func findDocs
                    ) // toArray
                } // enrDocs forEach func
             )  // enrDocs forEach
           }   // enrDocs find Func
        )  // enrDocs find toArray

    };
}

exports.question6 = function(collegeDB) {
    return group1Stat(collegeDB, "revenue") 
};

exports.question7 = function(collegeDB) {
    return group1Stat(collegeDB, "assets") 
};

exports.question8 = function(collegeDB) {
    return group1Stat(collegeDB, "liabs") 
};


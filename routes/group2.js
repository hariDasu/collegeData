var _ = require("underscore");
var q6StatsBySchoolYear={}    // key=UNITID_rowYear  val={ UNITID:x, statValue:x, instName:x, rowYear:x}

xtractOneResult=function(finDoc, enrDoc, statType) {
    var stat=null 
    var liabs,assets,revenue
    var students = enrDoc.EFYTOTLT;
    var unitid=enrDoc.UNITID;
    var year=enrDoc.rowYear;

    switch (statType) {
        case "revenue" :
            stat=finDoc.F1D01
            break;
        case "assets" :
            stat=finDoc.F1A18
            break;
        case "liabs" :
            stat=finDoc.F1A13
            break;

        case "all" :
            revenue=finDoc.F1D01
            assets=finDoc.F1A18
            liabs=finDoc.F1A13
            break;
    }

    if ( statType != "all"  ) {
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
            return oneResult
        } else {
            return null     // skip this (no stat was found)
        }

    }  else {    // all
        var liabsPerStud = Math.round(liabs/students*100)/100;   // stat per student
        var assetsPerStud = Math.round(assets/students*100)/100;   // stat per student
        var revenuePerStud = Math.round(revenue/students*100)/100;   // stat per student

        var oneResult={
            UNITID: unitid,
            YEAR : year,
            INSTNM: "TBD",
            STUDS: students,

            LIABS:  liabs,
            LIABS_PER_STUD: liabsPerStud,

            ASSETS:  assets,
            ASSETS_PER_STUD: assetsPerStud,

            REVENUE:  revenue,
            REVENUE_PER_STUD: revenuePerStud
        }
        return oneResult
    }
}

//-------------------------------------
statPicker= {
   "revenue" :  { 
       "projector" : {UNITID:1, F1D01:1, rowYear:1},
       "renderer" : "question6"
   },
   "assets" :  { 
       "projector" : {UNITID:1, F1A18:1, rowYear:1},
       "renderer" : "question7"
   },
   "liabs" :  { 
       "projector" : {UNITID:1, F1A13:1, rowYear:1},
       "renderer" : "question8"
   } ,
   "all" :  { 
       "projector" : {UNITID:1, F1A13:1, F1A18:1, F1D01:1, rowYear:1},
       "renderer" : "question9"
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
function showFinalResults(sortedIds,statType,res, max2Show){
    qnFinalResults=[]
    if ( statType == "all" ) {
         sortedIds.forEach( function (curSchoolYear) {     // no limit - all entries will be displayed (q9)
            qnFinalResults.push(q6StatsBySchoolYear[curSchoolYear])
         } )
        console.log(qnFinalResults.length)
        res.render("question9", {"finalResults": qnFinalResults});
    } else {
        for (i=0; i<max2Show; i++ ) {
            var curSchoolYear=sortedIds[i]
            qnFinalResults.push(q6StatsBySchoolYear[curSchoolYear])
        }
        console.log(qnFinalResults)
        jadeKey=statPicker[statType]["renderer"]
        res.render(jadeKey, {"finalResults": qnFinalResults});
    }
}

function qnInstNameJoin(res,statType, collegeDB, max2Show) 
{
    sortedSchoolYearKeys=schoolYearKeys
    if  (max2Show > 0 )  {
        sortedSchoolYearKeys = schoolYearKeys.sort(compare6)
    } else {
        max2Show=sortedSchoolYearKeys.length
    }

    retCnt=0
    collGEN=collegeDB.collection("GEN")
    // console.log("SortedIds=" + sortedSchoolYearKeys)
    for(i=0;i<max2Show;i++) {
        curUnitId=sortedSchoolYearKeys[i].split("_")[0]
        // console.log ( "Looking up [" + curUnitId + "]")
        collGEN.find({UNITID:parseInt(curUnitId)},{UNITID:1,INSTNM:1}).toArray(
            function (err, genDocs) {
                // console.log(genDocs)
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
                    if (retCnt == max2Show) {
                        showFinalResults(sortedSchoolYearKeys,statType, res, max2Show)
                    }
                } else {
                    retCnt++
                    if (retCnt == max2Show) {
                        showFinalResults(sortedSchoolYearKeys,statType,res, max2Show)
                    }
                }
            }
        )
    }
}

// finds UNIV names for top 30 stats only
// it uses the data provided in q6StatsBySchoolYear 
function joinStatsWithInstName(res,statType, collegeDB) {
    schoolYearKeys = Object.keys(q6StatsBySchoolYear);
    if  (statType == "all" ) {
         qnInstNameJoin(res,statType, collegeDB, -1)
    } else {
         qnInstNameJoin(res,statType, collegeDB, 20)
    }
}



function group1Stat( collegeDB, statType) {
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
                var projector=statPicker[statType]["projector"]
                console.log ("Now fetching Financials .. type=" + statType)
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
                                var oneResult=xtractOneResult(finDocs[0],enrDoc, statType)
                                if ( oneResult != null ) {
                                    q6StatsBySchoolYear[unitid+"_" +year]=oneResult
                                    rcnt=_.size(q6StatsBySchoolYear) + skipped
                                    if (rcnt == enrDocs.length ) {
                                       joinStatsWithInstName(res, statType, collegeDB)
                                    }
                                } else {
                                    skipped++
                                    rcnt=_.size(q6StatsBySchoolYear) + skipped
                                    if (rcnt == enrDocs.length ) {
                                        joinStatsWithInstName(res, statType, collegeDB)
                                    }
                                }
                            } else {
                                skipped++
                                rcnt=_.size(q6StatsBySchoolYear) + skipped
                                if (rcnt == enrDocs.length ) {
                                    joinStatsWithInstName(res, statType, collegeDB)
                                }
                            }
                            if ( enrDocs.length - rcnt > 20 ) {
                                if ( (rcnt % 1000) == 0 ) {
                                    console.log ("processed " + rcnt)
                                }
                            } else {
                                console.log ("processed " + rcnt)
                            }
                        }  // func finDocs
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

exports.question9 = function(collegeDB) {
    return group1Stat(collegeDB, "all") 
};


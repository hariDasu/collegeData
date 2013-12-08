var _ = require("underscore");

//Search by state abbreviation-----------------------------
exports.question10 = function(collegeDB) {

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

//---------------------------------------------------


// Max to Min Change in liabilities

exports.question11 = function(collegeDB) {
    var q11FinalResult=[]
    var q11DeltasBySchool={}

    function compare11(a,b) {
        var aLiabs = parseFloat(q11DeltasBySchool[a]["deltaLiabs"])
        var bLiabs = parseFloat(q11DeltasBySchool[b]["deltaLiabs"])

        if (aLiabs > bLiabs )  {
            //console.log ( "a > b" , aLiabs, bLiabs)
            return -1;
        }
        if (aLiabs < bLiabs) {
            //console.log ( "a < b" , aLiabs, bLiabs)
            return 1 ;
        }
        return 0;
    }

    function showFinalResults(sortedIds, req, res){
        q11FinalResult=[]
        for (i=0; i<20; i++ ) {
            var curUnitId=sortedIds[i]
            oneItem={
                "unitId" : curUnitId,
                "deltaLiabs" : q11DeltasBySchool[curUnitId]["deltaLiabs"],
                "totLiabs10" : q11DeltasBySchool[curUnitId]["totLiabs10"],
                "totLiabs11" : q11DeltasBySchool[curUnitId]["totLiabs11"],
                "instName" : q11DeltasBySchool[curUnitId]["instName"]
            }
            q11FinalResult.push(oneItem)
        }
        console.log(q11FinalResult)
        res.render('question11',{"question11":q11FinalResult});
    }

    function processFinalResults(req,res){
        unitIds = Object.keys(q11DeltasBySchool);
        sortedUnitIds = unitIds.sort(compare11)
        retCnt=0
        genColl=collegeDB.collection("GEN")
        //console.log("SortedIds=" + sortedUnitIds)
        for(i=0;i<20;i++) {
            curUnitId=sortedUnitIds[i]
            console.log ( "q11_Looking up [" + curUnitId + "]")
            genColl.find({UNITID:parseInt(curUnitId)},{UNITID:1,INSTNM:1}).toArray(
                function (err, doc1) {
                    console.log(doc1)
                    if ( doc1.length ) {
                        runitId=doc1[0].UNITID
                        q11DeltasBySchool[runitId]["instName"] = doc1[0].INSTNM
                        retCnt++
                        if (retCnt == 20) {
                            showFinalResults(sortedUnitIds, req,res)
                        }
                    } else {
                        retCnt++
                        if (retCnt == 20) {
                            showFinalResults(sortedUnitIds,req,res)
                        }
                    }
                }
            )
        }
    }
    //----------------------------------------

    return function(req, res) {
        collFin10 = collegeDB.collection("FIN10")   // financials-2010
        collFin11 = collegeDB.collection("FIN11")   // financials-2011
        //------------ Lvl1 Fetch -------
        console.log ("Q11: Fetching aggregate 2010 Liabilities..")
        collFin10.aggregate(
            {
                $group: { _id: "$UNITID",
                    totLiabs: { $sum: "$F1A13"}  }
            }, function (err, docs1) {
                console.log("Q11: Fetched " + docs1.length + " records");
                var skipped=0;
                var rcnt=0 ;      // count of processed records
                var pcnt=0 ;   // rcnt + skipped
                var liabs2010={}

                function skipIt() {
                    skipped++
                    pcnt=rcnt+skipped
                    if ( pcnt == docs1.length) {
                        console.log( "Done")
                        processFinalResults(req,res)
                    }
                }

                function takeIt() {
                    rcnt++
                    pcnt=rcnt+skipped
                    if ( pcnt == docs1.length) {
                        console.log( "Done")
                        processFinalResults(req,res)
                    }
                }

                console.log("Q11: Now Fetch matching corresponding 2011 liabilities");
                docs1.forEach( function(doc1){
                        liabs2010[doc1._id]=doc1.totLiabs
                        // db.ENR11.aggregate( [ { $match : { UNITID: 196307} }, { $group : {_id: "$UNITID", "totStuds": { $sum: "$EFYTOTLT"} } } ] )
                        collFin11.aggregate(
                            [
                                {
                                    $match : {
                                        UNITID : parseInt(doc1._id)
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$UNITID",
                                        totLiabs: { $sum: "$F1A13"}
                                    }
                                }
                            ] , function (err, docs2) {
                                if  (docs2.length ) {
                                    var unitId=docs2[0]._id
                                    var totLiabs11=(docs2[0].totLiabs)
                                    var totLiabs10=liabs2010[unitId]
                                    // console.log (totLiabs10, " -->  " ,  totLiabs11)
                                    if ( isNaN(totLiabs11) || isNaN(totLiabs10) ) {
                                        skipIt()
                                    } else if ( totLiabs10 == 0 ) {
                                        skipIt()
                                    } else {
                                        //console.log( "UNITID: " +  unitId )
                                        //console.log( "2011: " +  totLiabs11 )
                                        //console.log( "2010: " +  totLiabs10 )
                                        var deltaPercent= ((totLiabs11 - totLiabs10 )/totLiabs10)*100
                                        q11DeltasBySchool[unitId]={
                                            "totLiabs11" : totLiabs11,
                                            "totLiabs10" : totLiabs10,
                                            "deltaLiabs" : Math.round( deltaPercent *100) / 100
                                        }
                                        takeIt()
                                    }
                                } else {
                                    skipIt()
                                }

                                if ( (docs1.length - pcnt) < 20 )  {
                                    console.log ("Q11: " + pcnt )
                                }  else {
                                    if  ( (pcnt % 1000 ) == 0 ) {
                                        console.log ("q11: " + pcnt )
                                    }
                                }
                            }
                        )
                    }  // docs.forEach
                )
            }  // agg Lvl1 CB func
        )  // agg Lvl 1
    }  // outer func (req,res)
} // exported func


//---------------------------------------------------------
exports.question12 = function(collegeDB) {
    var q12DeltasBySchool={}

    function compare12(a,b) {
        if (q12DeltasBySchool[a]["deltaPercent"] > q12DeltasBySchool[b]["deltaPercent"])
            return -1;
        if (q12DeltasBySchool[a]["deltaPercent"] < q12DeltasBySchool[b]["deltaPercent"])
            return 1;
        return 0;
    }

    function showFinalResults(sortedIds, req, res){
        var q12FinalResult=[]
        for (i=0; i<20; i++ ) {
            var curUnitId=sortedIds[i]
            oneItem={
                "unitId" : curUnitId,
                "deltaPercent" : q12DeltasBySchool[curUnitId]["deltaPercent"],
                "totStuds2010" : q12DeltasBySchool[curUnitId]["totStuds2010"],
                "totStuds2011" : q12DeltasBySchool[curUnitId]["totStuds2011"],
                "instName" : q12DeltasBySchool[curUnitId]["instName"]
            }
            q12FinalResult.push(oneItem)
        }
        console.log(q12FinalResult)
        res.render('question12',{"question12":q12FinalResult});
    }

    function processFinalResults(req,res){
        unitIds = Object.keys(q12DeltasBySchool);
        sortedUnitIds = unitIds.sort(compare12)
        retCnt=0
        genColl=collegeDB.collection("GEN")
        //console.log("SortedIds=" + sortedUnitIds)
        for(i=0;i<20;i++) {
            curUnitId=sortedUnitIds[i]
            console.log ( "Looking up [" + curUnitId + "]")
            genColl.find({UNITID:parseInt(curUnitId)},{UNITID:1,INSTNM:1}).toArray(
                function (err, doc1) {
                    console.log(doc1)
                    if ( doc1.length ) {
                        runitId=doc1[0].UNITID
                        q12DeltasBySchool[runitId]["instName"] = doc1[0].INSTNM
                        retCnt++
                        if (retCnt == 20) {
                            showFinalResults(sortedUnitIds, req,res)
                        }
                    } else {
                        retCnt++
                        if (retCnt == 20) {
                            showFinalResults(sortedUnitIds,req,res)
                        }
                    }
                }
            )
        }
    }
    //----------------------------------------
    return function(req, res) {
        collEnr10 = collegeDB.collection("ENR10")   // enrollments-2010
        collEnr11 = collegeDB.collection("ENR11")   // enrollments-2011
        var  totStudents2010={}
        //------------ Lvl1 Fetch -------
        console.log ("Q12: Fetching aggregate 2010 enrollments ..")
        collEnr10.aggregate(
            {
                $group: { _id: "$UNITID",
                    totStuds: { $sum: "$EFYTOTLT"}  }
            }, function (err, docs1) {
                console.log("Q12: Fetched " + docs1.length + " records");
                var skipped=0;
                var rcnt=0 ;      // count of processed records
                var pcnt=0 ;   // rcnt + skipped
                console.log("Q12: Now Fetch matching 2011 enrollments");
                docs1.forEach( function(doc1){
                        // db.ENR11.aggregate( [ { $match : { UNITID: 196307} }, { $group : {_id: "$UNITID", "totStuds": { $sum: "$EFYTOTLT"} } } ] )
                        totStudents2010[doc1._id] = doc1.totStuds
                        collEnr11.aggregate(
                            [
                                {
                                    $match : {
                                        UNITID : parseInt(doc1._id)
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$UNITID",
                                        totStuds: { $sum: "$EFYTOTLT"}
                                    }
                                }
                            ] , function (err, docs2) {
                                // console.log (docs2)
                                if  (docs2.length ) {
                                    rcnt++
                                    var unitId=docs2[0]._id
                                    var totStuds11=docs2[0].totStuds
                                    var totStuds10=totStudents2010[unitId]
                                    //console.log( "UNITID: " +  unitId )
                                    //console.log( "2011: " +  totStuds11 )
                                    //console.log( "2010: " +  totStuds10 )
                                    //var deltaPercent=( (totStuds11 - totStuds10) / totStuds10 )*100
                                    var deltaPercent=(totStuds11 - totStuds10) / totStuds10 * 100
                                    q12DeltasBySchool[unitId]={
                                        "totStuds2011" : totStuds11,
                                        "totStuds2010" : totStuds10,
                                        //"deltaPercent" : Math.round(deltaPercent*100)/100
                                        "deltaPercent" : Math.round(deltaPercent*100)/100
                                    }
                                    pcnt=rcnt+skipped
                                    if ( pcnt == docs1.length) {
                                        console.log( "Done")
                                        processFinalResults(req,res)
                                    }
                                } else  {
                                    skipped++
                                    pcnt=rcnt+skipped
                                    if ( pcnt == docs1.length) {
                                        console.log( "Done")
                                        processFinalResults(req,res)
                                    }
                                }

                                if ( (docs1.length - pcnt) < 20 )  {
                                    console.log ("q12: " + pcnt )
                                }  else {
                                    if  ( (pcnt % 1000 ) == 0 ) {
                                        console.log ("q12: " + pcnt )
                                    }
                                }
                            }
                        )
                    }  // docs.forEach
                )
            }  // agg Lvl1 CB func
        )  // agg Lvl 1
    }  // outer func (req,res)
} // exported func

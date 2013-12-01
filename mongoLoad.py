#!/bin/env python2.7
#-----------------------------
# vi: sw=4 ts=4 expandtab
#-----------------------------
import os,sys,pdb,glob,pprint
import pymongo

csvData={}
rowTypes={ 
    "h" : "GEN", 
    "f" : "FIN",  
    "e" : "ENR"
}

def  __prepLoadData(dataDir="../data/") :
    print "Hello Loading CSVs from %s"  % (dataDir)
    flist=glob.glob(os.path.join(dataDir, "*.csv") )
    colList={}
    for  csvFile in (flist) :
        oneCsv=os.path.basename(csvFile)
        print "=======\nBegin " + oneCsv 
        lcnt=0
        with  open (csvFile) as f:
            for line in  f.readlines() :
                if lcnt==0 :
                    if csvData.get(oneCsv, None) == None :
                        csvData[oneCsv]={}
                    colList=line.strip().split(",")
                #elif lcnt < 2 :
                else :
                    if csvData[oneCsv].get("rows", None) == None :
                        csvData[oneCsv]["rows"]=[]
                    lvals=line.strip().split(",")
                    lineValues=[]
                    for item in lvals :
                        ii=item
                        if item.startswith('"') or item.endswith('"') :
                           ii=str(item.strip('"'))
                        else :
                            try :
                                if not '.' in  item :
                                    ii=int(item)
                                else :
                                    ii=float(item)
                            except :
                                if not ii  in ('', '.') :
                                    print ii
                        lineValues.append(ii)
                    rowDict=dict(zip (colList, lineValues))
                    rowKey="%s_%d" % (oneCsv, lcnt)
                    rowDict["_id"]=rowKey
                    rowType=rowTypes.get(oneCsv[0], "UNK")
                    rowDict["rowType"]=rowType
                    if rowType != "GEN" :
                        if "11" in oneCsv :
                            rowDict["rowYear"]=2011
                        else :
                            rowDict["rowYear"]=2010
                    csvData[oneCsv]["rows"].append(rowDict)
                lcnt+=1
            print " Line count=%d" % (lcnt)


#--------------------------
def __initMongoDB() :
    conn=pymongo.Connection('localhost', 27017)
    db=conn.collegeDB
    db.GEN.remove()
    db.ENR.remove()
    db.FIN.remove()
    db.ENR10.remove()
    db.FIN10.remove()
    db.ENR11.remove()
    db.FIN11.remove()
    return db
#--------------------------
def loadCollegeDB(dataDir="./data") :
    __prepLoadData(dataDir=dataDir)
    #pp.pprint(csvData)
    db=__initMongoDB()
    for  oneCsv in csvData.keys() :
        print "Inserting into %s" % (oneCsv)
        errCnt=0
        for  oneRow in csvData[oneCsv]['rows'] :
            try :
                if oneRow['rowType'] == "GEN" :
                     db.GEN.insert(oneRow)
                elif oneRow['rowType'] == "FIN" :
                    if oneRow['rowYear'] == 2010 :
                        db.FIN10.insert (oneRow)
                    else :
                        db.FIN11.insert (oneRow)
                elif oneRow['rowType'] == "ENR" :
                    if oneRow['rowYear'] == 2010 :
                        db.ENR10.insert (oneRow)
                    else :
                        db.ENR11.insert (oneRow)
            except  Exception,e :
                print "Error: %s" % (oneRow['_id'])
                errCnt+=1
        print "ERR_CNT=%d\n===========" % (errCnt)
#--------------------------
# db.ENR10.aggregate ( { $group : { _id : "$UNITID",  totStuds: { $sum : "$EFYTOTLT"}  } } )
# db.FIN10.aggregate ( { $group : { _id : "$UNITID",  assets: { $sum : "$F1A13"}  } } )

if __name__ == "__main__" :
    pp=pprint.PrettyPrinter(indent=4)
    loadCollegeDB(dataDir="./data")

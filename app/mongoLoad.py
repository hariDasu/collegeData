#!/bin/env python2.7
#-----------------------------
# vi: sw=4 ts=4 expandtab
#-----------------------------
import os,sys,pdb,glob,pprint
import pymongo

pp=pprint.PrettyPrinter(indent=4)

csvData={}
rowTypes={ 
    "h" : "GEN", 
    "f" : "FIN",  
    "e" : "ENR"
}

def  prepLoadData() :
    print "Hello Loading CSVs .."
    flist=glob.glob("../data/*.csv")
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
                    lineValues=line.strip().split(",")
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
def initMongoDB() :
    conn=pymongo.Connection('localhost', 27017)
    db=conn.collegeDB
    db.univs.remove()
    return db
    
#--------------------------

if __name__ == "__main__" :
    prepLoadData()
    #pp.pprint(csvData)
    db=initMongoDB()
    for  oneCsv in csvData.keys() :
        print "Inserting into %s" % (oneCsv)
        errCnt=0
        for  oneRow in csvData[oneCsv]['rows'] :
            try :
                db.univs.insert (oneRow)
            except  Exception,e :
                print "Error: %s" % (oneRow['_id'])
                errCnt+=1
        print "ERR_CNT=%d\n===========" % (errCnt)

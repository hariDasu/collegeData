#!/bin/env python
#-----------------------------
# vi: sw=4 ts=4 expandtab
#-----------------------------
import os,sys,pdb,glob,pprint

pp=pprint.PrettyPrinter(indent=4)

csvData={}

def  doLoadStuff() :
    print "Hello Loading CSVs .."
    flist=glob.glob("../data/*.csv")
    for  oneCsv in flist :
        print "=======\nBegin " + oneCsv 
        lcnt=0
        with  open (oneCsv) as f:
            for line in  f.readlines() :
                if lcnt==0 :
                    if csvData.get(oneCsv, None) == None :
                        csvData[oneCsv]={}
                    csvData[oneCsv]["colList"]=line.strip().split(",")
                elif lcnt<2 :
                    if csvData[oneCsv].get("rows", None) == None :
                        csvData[oneCsv]["rows"]=[]
                    lineValues=line.strip().split(",")
                    rowDict=dict( zip (csvData[oneCsv]["colList"], lineValues) )
                    csvData[oneCsv]["rows"].append(rowDict)
                lcnt+=1
            print " Line count=%d" % (lcnt)


if __name__ == "__main__" :
    doLoadStuff()
    pp.pprint(csvData)

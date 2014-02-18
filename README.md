
collegeData
===========

[CollegeData](http://collegedata.pytools.webfactional.com/question1 "College Data project on WebFaction")
```
project for IS218- Fall 2013

A practice in learning & using nodeJS with with MongoDB
```
#What is being used:

+ NodeJS
+ MongoDB
+ Express
+ Jade
+ Underscore(minimally)
+ jQuery
+ Twitter Bootstrap 3.0
+ DataTables
+ Forever (running app.js as a daemon)
+ & a whole lotta hashes.

#The approach

-The data is loaded into 3 collections, 
  - ENR (effy csvs)
  - FIN (f-- csvs)
  - GEN (hd2011.csv)

NodeJS is being used with JavaScript on the server side to manage
what data from MongoDB is being displayed. The Express framework is
being utilized to handle the routes and ultimately where (what URL)
the user must visit to access the view. The view itself is being rendered
using the Jade Templating engine in conjunction with Twitter Bootstrap
for some responsive-ness. In Question 9, the query was conducted to
extract all the data into one large array, and this array was passed to
DataTables, an elegant and simple way to display the results in a sortable
fashion. Using DataTables helps to reduce the delay time since only one
HTTP request is being made to the web server. The re-sorting of the data
is being done instantly on the client's browser using jQuery.The result
set is being limited to exclude results that don't have data for all the
columns shown in the DataTable. Forever was used in place of nohup.Underscore 
provided some nice wrapper functions which made it easier to write code
rather than creating functions myself, like in this simple example for 
finding the size of an array:

```javascript
rcnt = _.size(q6Results) +skipped;
```
  


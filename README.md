
collegeData
===========
```
75.126.159.214:11027/question1

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
+ & a whole lotta hashes.

#The approach

-The data is loaded into 5 collections, 
  - ENR10 (enrollment 2010 (effy2010.csv)
  - ENR11 (effy2011.csv)
  - FIN10 (FIN2010.csv)
  - FIN11 (FIN2011.csv)
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
is being done instantly on the client's browser using jQuery. Underscore was
used merely to retrieve the length of an array in JavaScript without having
to create a function just to do this:

```javascript
rcnt = _.size(q6Results) +skipped;
```
  


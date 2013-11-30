
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , college = require('./routes/college')
  , http = require('http')
  , path = require('path');

var mongo = require('mongodb');
// var monk = require('monk');
// var db = monk('localhost:27017/collegeDB');

var db1=null ;
mongo.MongoClient.connect( 'mongodb://localhost:27017/collegeDB', function (err, db) {
   if (err)  return console.dir(err)
   db1=db
});
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 11027);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/college', college.list);
app.get('/helloworld', routes.helloworld);

app.get('/univs', routes.univs(db1));


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/index')
  , http = require('http')
  , path = require('path');

var _ = require('underscore');
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


app.get('/question1',routes.question1());
app.get('/question2',routes.question2());
app.get('/question3',routes.question3());
app.get('/question4',routes.question4());
app.get('/question10',routes.question10());
app.get('/question6',routes.question6());
app.get('/question7',routes.question7());
app.get('/question8',routes.question8());
app.get('/question9',routes.question9());
app.get('/question12',routes.question12());
app.get('/question11',routes.question11());
app.get('/univTest', routes.univTest());



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

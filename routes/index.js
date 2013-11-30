
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.helloworld = function(req, res){
    res.render('helloworld', { title: 'Hello, World!' });
};

exports.univs = function(db) {
    return function(req, res) {
       coll = db.collection("univs")
       coll.find( {rowType: "ENR"}, {UNITID: 1, EFYTOTL:1}, function (err, results) {
           console.log (results)
       } )
    };
};



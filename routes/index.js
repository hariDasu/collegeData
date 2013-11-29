
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
        var collection = db.get('colleges');
        collection.find({},{},function(e,docs){
            res.render('univs', {
                "colleges" : docs
            });
        });
    };
};
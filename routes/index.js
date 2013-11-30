
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
        var collection = db.get('univs');
        collection.find({rowType:"ENR"},{EFYTOTLT:1,UNITID:1},{stream:true})
        .each(function(doc){
            console.log(doc);
        });
    };
};

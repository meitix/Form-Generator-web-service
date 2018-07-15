(function (repositoryBase) {
    var mongodb = require('mongodb');

    var cs = 'mongodb://localhost:27017/TadFormGenerator';
    var theDb = null;


    repositoryBase.getDatabase = function (job) {
        if (theDb) {
            job(theDb, null);
        } else {
            mongodb.MongoClient.connect(cs, function (err, db) {
                if (err) {
                    job(null, err);
                } else {
                    theDb = db;
                    job(db, null);
                }
            });
        }
    }

})
(module.exports)
(function (userRepository) {
    var repoBase = require('./repository-base');
    var mongo = require("mongodb");

    var usersCollectionName = "users";

    userRepository.createUser = function (user, next) {
        repoBase.getDatabase(function (db, err) {
            if (err) {
                next(err, null);
            } else {
                db.collection(usersCollectionName).insertOne(user, next);
            }
        });
    }

    // returns boolean value to next function
    userRepository.isExists = function(username, next) {
        repoBase.getDatabase(function(db, err) {
            if (err) {
                next(err, null);
                console.log(err);
            } else {
                db.collection(usersCollectionName).findOne({ username: username },function(err, user) {
                    next(err, user);
                });
            }
        });
    }

    // get single user by custom condition.
    userRepository.getUserByCondition = function(condition, next) {
        repoBase.getDatabase(function(db, err) {
            if (err) {
                next(err, null);
                console.log(err);
            } else {
                db.collection(usersCollectionName).findOne(condition, next);
            }
        });
    }

    // get single user by custom condition.
    userRepository.getManyUsersByCondition = function(condition , selectedFields , next) {
        repoBase.getDatabase(function(db, err) {
            if (err) {
                next(err, null);
                console.log(err);
            } else {
                db.collection(usersCollectionName).find(condition , selectedFields).toArray(next);
            }
        });
    }

    // get all users
    userRepository.getAllUsers = function(next) {
        repoBase.getDatabase(function(db, err) {
            if (err) {
                next(err, null);
                console.log(err);
            } else {
                db.collection(usersCollectionName).find().toArray(next);
            }
        });
    }

    userRepository.getById = function (id, next)
    {
        repoBase.getDatabase(function(db, err) {
            if (err) {
                next(err, null);
                console.log(err);
            } else {
                var objId = new mongo.ObjectID(id);
                db.collection(usersCollectionName).findOne({ _id: objId } , next);
            }
        });
    }

    userRepository.update = function (user, next) {
        repoBase.getDatabase(function (db, err) {
            if (err) {
                next(err, null);
                console.log(err);
            } else {
                var objId = null;
                if (!user._id._bsontype)
                    objId = new mongo.ObjectID(user._id);
                else
                    objId = user._id;

                db.collection(usersCollectionName).updateOne({ _id: objId } , user, next);
            }
        });
    }
})(module.exports);
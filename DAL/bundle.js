(function (formRepository) {

    var repoBase = require("./repository-base");
    var mongo = require('mongodb');
    var formsCollectionName = "forms";


    // دریافت فرم با آی دی
    formRepository.getFormById = function (id, next) {
        repoBase.getDatabase(function (db, err) {
            if (err) {
                next(err, null);
            } else {
                var objId = new mongo.ObjectID(id);
                db.collection(formsCollectionName).find({ _id: objId }).toArray(function (err, form) {
                    next(err, form[0]);
                });
            }
        });
    }

    // دریافت همه فرم ها
    formRepository.getAll = function (next) {
        repoBase.getDatabase(function (db, err) {
            if (err) {
                next(null, err);
            } else {
                var r = db.collection(formsCollectionName)
                    .find()
                    .sort({ _id: -1 })
                    .toArray(function (err, result) {
                        next(result, err);
                    });

            }
        });
    }


    // اضافه کردن یک فرم
    formRepository.addForm = function (form, resultHandler) {

        repoBase.getDatabase(function (db, err) {
            if (err) {
                console.log(err);
                resultHandler(err, null, form);
            } else {
                if (!form._id) {
                    delete form._id;
                    db.collection(formsCollectionName).insertOne(form, function (res) {
                        resultHandler(err, res, form);
                    });
                } else {
                    form._id = new mongo.ObjectID(form._id);
                    db.collection(formsCollectionName).update({ _id: form._id }, form, function (res) {
                        resultHandler(err, res, form);
                    });;
                }
            }
        });
    }

    // اضافه کردن یک آرایه از فرم ها
    formRepository.addManyForms = function (forms, resultHandler) {

        repoBase.getDatabase(function (db, err) {
            if (err) {
                console.log(err);
                resultHandler(err, null, forms);
            } else {
                db.collection(formsCollectionName).insertMany(forms)
                    .then(function (res) {
                        resultHandler(err, res, forms);
                    });
            }
        });
    }

    // delete form
    formRepository.delete = function (formId, next) {
        repoBase.getDatabase(function (db, err) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                var _id = new mongo.ObjectID(formId);
                db.collection(formsCollectionName).deleteOne({ _id: _id }, function (err, obj) {
                    next(err);
                });
            }
        });
    }

    // add form result
    formRepository.addformResult = function (formId, results, next) {
        repoBase.getDatabase(function (db, err) {
            if (err) {
                next(err, null);
                console.log(err);
            } else {
                var id = new mongo.ObjectID(formId);
                db.collection(formsCollectionName).find({ _id: id }).toArray(function (e, form) {
                    if (e) {
                        next(e, null);
                    } else {
                        if (results._id) {
                            var resId = new mongo.ObjectID(results._id);
                            results._id = resId;
                            db.collection(formsCollectionName).updateOne({ "results._id": resId }, { $set: { "results.$": results} } , next);
                        } else {

                            form = form[0];
                            results._id = new mongo.ObjectID();
                            form.results = form.results || [];
                            form.results.push(results);
                            delete form._id;
                            db.collection(formsCollectionName).updateOne({ _id: id },
                                form,
                                function (error, updateResult) {
                                    if (error) {
                                        next(error, null);
                                    } else {
                                        next(null, updateResult);
                                    }
                                });
                        }
                    }
                });
            }
        });
    }

    formRepository.getFormsByIds = function (ids, next) {

        repoBase.getDatabase(function (db, err) {
            if (err) {
                console.log(err);
                next(err);
            } else {
              
                db.collection(formsCollectionName).find({ _id: {$in: ids} }).toArray(next);
            }
        });
    }

    formRepository.deleteFormResult = function(data, next) {
        repoBase.getDatabase(function (db, err) {
            if (err) {
                console.log(err);
                next(err);
            } else {
               var resultId = new mongo.ObjectID(data.resultId);
               var formId = new mongo.ObjectID(data.formId);
                db.collection(formsCollectionName).update({_id: formId}, { $pull:{results: {_id: resultId} }}, next);
            }
        });
    }

})(module.exports)
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
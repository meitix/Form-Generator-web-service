(function(userManager) {
    var repo = require('../../DAL/users-repository');
    var formRepo = require('./../../DAL/forms-repository');

    var persianDate = require("jalaali-js");

    userManager.register = function(user , next) {
        if (user.username && user.password) {
            repo.isExists(user.username,
                function (err, existedUser) {
                    if (!existedUser) {
                        user.username = user.username.toLowerCase();
                        user.createDate = persianDate.toJalaali(new Date());
                        user.active = true;
                        user.roles = ["کاربر عادی"];
                        repo.createUser(user, next);
                    } else {
                        next({ errmsg: "username is exists" }, null);
                    }
                });

        } else {
            next({ errmsg: "username and password are required." } , null);
        }
    }

    // gat all users.
    userManager.getAll = function(next) {
        repo.getAllUsers(function(err, forms) {
            if (err) {
                console.log(err);
                next(err, null);
            } else {
                next(null, forms);
            }
        });
    }

    // get user by id.
    userManager.getUserById = function(id, next) {
        repo.getById(id, next);
    }

    // login.
    userManager.login = function(username, password, next) {
        repo.getUserByCondition({ username: username.toLowerCase(), password: password }, next);
    }

    // search by username
    userManager.searchUserByUsername = function(username, next) {
        repo.getManyUsersByCondition({ username: {$regex: ".*"+username.toLowerCase()+".*"}}  , {username:1}, next);
    }

    // add users to form
    userManager.addUsersToForm = function (data, next) {
        var i = 0;
        data.forEach(d => {
            repo.getById(d.user._id,
                function(err, user) {
                    if (user) {
                        user.forms = user.forms || [];

                        // delete access of this form from user forms.
                        user.forms = user.forms.filter(f => {
                            return f.formId !== d.formId;
                        });

                        // add new access of this form to user forms.
                        user.forms.push({ formId: d.formId, role: d.role });

                        // save changes to database.
                        repo.update(user , function(err, user) {
                            if (err) {
                                next(err, null);
                            } else {
                                i++;
                                if (i === data.length) {
                                    next(null, { addedResultCount: i });
                                }
                            }
                        } );
                    } else {
                        next(err, null);
                    }
                });
        });
        if (data.length > 0) {
            var formId = data[0].formId;
            formRepo.getFormById(formId , function(err, form) {
                if (!err) {
                    form.users = data;
                    formRepo.addForm(form,
                        function(err, d) {
                            console.log(d);
                        });
                }
            });
            
        }
    }

})(module.exports)
(function(formManager) {
  var persianDate = require("jalaali-js");

  var repo = require("../../DAL/forms-repository");
  var userRepo = require("./../../DAL/users-repository");
  var mongo = require("mongodb");

  // get single form by id
  formManager.getFormById = function(id, next) {
    repo.getFormById(id, next);
  };
  // get all forms
  formManager.getAll = function(next) {
    repo.getAll(next);
  };

  // add form
  formManager.addForm = function(form, user, next) {
    userRepo.getById(user._id, function(err, user) {
      if (!user) {
        next(err, null);
      } else {
        repo.addForm(form, function(err, res, form) {
          user.forms = user.forms || [];
          var formId = form._id.toString();
          user.forms.push({ formId: formId, role: "مدیر کل" });
          userRepo.update(user, next);
        });
      }
    });
  };
  //add many forms
  formManager.addManyForms = function(forms, next) {
    repo.addManyForms(forms, next);
  };

  // delete form
  formManager.delete = function(formId, next) {
    repo.delete(formId, function(err) {
      if (!err) {
        next(true, null);
      } else {
        next(null, err);
      }
    });
  };

  // save form result
  formManager.addFormResult = function(formId, results, _id, next) {
    results._id = _id;
    results["date"] = persianDate.toJalaali(new Date());
    repo.addformResult(formId, results, next);
  };

  // get single form results
  formManager.getFormResults = function(formId, userId, next) {
    repo.getFormById(formId, function(err, form) {
      if (err) {
        next(err, null);
        console.log(err);
      } else {
        userRepo.getById(userId, function(err, user) {
          if (err) {
            next(err, null);
          }
          user.forms = user.forms || [];
          var access = user.forms.filter(f => {
            return f.formId === formId;
          });

          access = access[0];

          form.results = form.results || [];

          if (access.role === "وارد کننده اطلاعات") {
            form.results = form.results.filter(res => {
              return res["کاربر"] === user.username;
            });
          } else {
            form.results = form.results || [];
          }
          next(null, form.results);
        });
      }
    });
  };

  formManager.getFormsByUserRoleName = function(userId, roleNames, next) {
    userRepo.getById(userId, function(err, user) {
      if (err) {
        next(err, null);
      } else {
        user.forms = user.forms || [];
          var filteredForms;
        // get forms that filtered by user role.
        if (roleNames && roleNames.length > 0) {
            filteredForms = user.forms.filter(function(item) {
                var res = false;
                for (var i = 0; i < roleNames.length; i++) {
                    res = item.role === roleNames[i];
                }
                return res;
            });
        } else {
            filteredForms = user.forms;
        }

        var ids = [];

        filteredForms.forEach(frm => {
          frm.formId = new mongo.ObjectID(frm.formId);
          ids.push(frm.formId);
        });

        repo.getFormsByIds(ids, next);
      }
    });
  };

  formManager.getFormUsers = function(formId, next) {
    repo.getFormById(formId, function(err, form) {
      if (err) {
        next(err, null);
      } else {
        if (form) {
          next(null, form.users);
        } else {
          next(null, []);
        }
      }
    });
  };

  formManager.deleteFormResult = function(data, next) {
    repo.deleteFormResult(data, next);
  };
})(module.exports);

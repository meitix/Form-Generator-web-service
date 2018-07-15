(function (formController) {
    formController.init = function (app) {

        var manager = require('../BLL/form-manager');
        app.get("/form/:id",
            function (req, res) {
                var id = req.params.id;
                if (id != null) {
                    manager.getFormById(id, function (err, form) {
                        res.send({ error: err, form: form });
                    });
                } else {
                    res.send({ error: 'آی دی فرم دریافت نشد' });
                }
            });
        app.get("/forms",
            function (req, res) {
                manager.getAll(function (forms, err) {
                    res.send({ forms: forms, error: err });
                });
            });
        // add form.
        app.post("/addForm",
            function (req, res) {
                var form = req.body.form;
                var user = req.body.user;

                manager.addForm(form, user, function (err, result, form) {
                    res.send({ error: err, result: result, form: form });
                });
            });

        // add multiple forms.
        app.post("/addManyForms",
            function (req, res) {
                manager.addManyForms(req.body,
                    function (err, result, forms) {
                        res.send({ error: err, result: result, forms: forms });
                    });
            });

        // delete form.
        app.post("/delete",
            function (req, res) {
                manager.delete(req.body.formId,
                    function (status, err) {
                        res.send({ error: err, status: status });
                    });
            });

        // send single post result.
        app.post("/formResult",
            function (req, res) {
                manager.addFormResult(req.body.formId, req.body.results, req.body._id, function (err, result) {
                    res.send({ error: err, message: '', success: !err, data: null });
                });
            });

        // get form results.
        app.get("/formResult/:formId/:userId",
            function (req, res ) {
                manager.getFormResults(req.params.formId, req.params.userId, function (err, result) {
                    res.send({ error: err, message: '', success: !err, data: result });
                });
            });

        // get the forms that specific user is super admin on that.
        app.get("/usersForms/:userId",
            function (req, res) {
                if (!req.params.userId) {
                    res.send({ error: { errmsg: 'invalid request' }, message: '', success: false, data: null });
                } else {
                    manager.getFormsByUserRoleName(req.params.userId, ['مدیر کل'], function (err, forms) {
                        res.send({ error: err, message: '', success: !err, data: forms });
                    });
                }
            });

        // get the forms that specific user is writer on that.
        app.get("/usersSideForms/:userId",
            function (req, res) {
                if (!req.params.userId) {
                    res.send({ error: { errmsg: 'invalid request' }, message: '', success: false, data: null });
                } else {
                    manager.getFormsByUserRoleName(req.params.userId, null, function (err, forms) {
                        res.send({ error: err, message: '', success: !err, data: forms });
                    });
                }
            });

        // get: get form users.
        app.get("/formUsers/:formId", function (req, res) {
            if (!req.params.formId) {
                res.send({
                    error: { errmsg: "آی دی فرم یافت نشد." },
                    message: this.error.errmsg,
                    success: false,
                    data: null
                });
            } else {
                manager.getFormUsers(req.params.formId, function (err, users) {
                    res.send({ error: err, message: "", success: !err, data: users });
                });
            }
        });

        // get: delete result
        app.post("/formResult/delete",
            function(req, res) {
                manager.deleteFormResult({ resultId: req.body.resultId , formId: req.body.formId },function(err, result) {
                    res.send({error: err , message: "" , success: !err , data: result});
                });
            });

    }
})(module.exports)
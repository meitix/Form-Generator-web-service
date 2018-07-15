(function (userController) {

    var manager = require("./../BLL/user-manager");

    userController.init = function (app) {

        // post: register.
        app.post("/register",
            function (req, res) {
                var user = { username: req.body.username, password: req.body.password };
                manager.register(user,
                    function (err, data) {
                        res.send({ error: err, message: '', success: !err, data: data });
                    });
            });

        // get: all users
        app.get("/getAllUsers", function (req, res) {
            manager.getAll(function (err, forms) {
                res.send({ error: err, message: '', success: !err, data: forms });
            });
        });

        // get: user data.
        app.get("/getUser/:id", function (req, res) {
            var id = req.params.id;
            if (!id) {
                res.send({
                    error: { errmsg: 'آی دی کاربر اجباری است' },
                    message: 'آی دی کاربر اجباریست',
                    success: false,
                    data: null
                });
            } else {
                manager.getUserById(id, function (err, user) {
                    res.send({ error: err, message: '', success: !err, data: user });
                });
            }
        });

        // post: login
        app.post("/login", function (req, res) {
            if (req.body.username && req.body.password) {
                manager.login(req.body.username,
                    req.body.password,
                    function (err, user) {
                        res.send({ error: err, message: '', success: !err, data: user });
                    });
            } else {
                res.send({
                    error: { errmsg: "نام کاربری و کلمه عبور وارد نشده است" },
                    message: "",
                    succuss: false,
                    data: null
                });
            }
        });

        // get: search users by username
        app.get('/searchUsers/:username',
            function (req, res) {
                if (!req.params.username) {
                    res.send({ error: { errmsg: "نام کاربری اجباری است." }, message: '', success: false, data: null });
                } else {
                    manager.searchUserByUsername(req.params.username, function (err, users) {
                        res.send({ error: err, message: '', success: !err, data: users });
                    });
                }
            });

        // post: add users to form with role
        app.post("/addUsersToForm", function (req, res) {

            if (req.body.length > 0 || req.body !== []) {
                manager.addUsersToForm(req.body, function (err, data) {
                    res.send({ error: err, message: "", success: !err, data: data });
                });
            } else {
                res.send({
                    error: { errmsg: "اطلاعات وارد شده صحیح نیست" },
                    message: "اطلاعات وارد شده صحیح نیست",
                    success: false,
                    data: null
                });
            }
        });

      
    }


})(module.exports);
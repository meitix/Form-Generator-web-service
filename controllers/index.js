(function(controllers) {
    var formController = require('./formController');
    var userController = require("./userController");

    controllers.init = function(app){
        formController.init(app);
        userController.init(app);
    }

})(module.exports)
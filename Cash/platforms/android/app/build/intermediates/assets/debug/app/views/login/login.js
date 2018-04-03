var UserViewModel = require("../../shared/view-models/user-view-model");
var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");

var user = new UserViewModel({
    email: "pepebiondi@pepe.com",
    password: "pepe"
});

var page;
var email;

exports.loaded = function(args) {
    page = args.object;
    page.bindingContext = user;
};

exports.signIn = function() {
    user.login()
        .catch(function(error) {
            console.log(error);
            dialogsModule.alert({
                message: "Unfortunately we could not find your account.",
                okButtonText: "OK"
            });
            return Promise.reject();
        })
        .then(function() {
            frameModule.topmost().navigate("views/list/list");
        });
}

exports.register = function() {
    var topmost = frameModule.topmost();
    topmost.navigate("views/register/register");
}
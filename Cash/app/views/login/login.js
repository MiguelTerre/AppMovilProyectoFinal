var UserViewModel = require("../../models/users/user-view-model");
var frameModule = require("ui/frame");

var user = new UserViewModel();

var page;


exports.loaded = function (args) {
    page = args.object;
    page.bindingContext = user;
};

exports.signIn = function () {
    frameModule.topmost().navigate({ 
        moduleName: "start", 
        clearHistory: true, 
        context: { 
            username: user.username, 
            password: user.password 
        } 
    });
}
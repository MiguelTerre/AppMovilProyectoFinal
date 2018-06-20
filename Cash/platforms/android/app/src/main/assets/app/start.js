var appSettings = require("application-settings");
var frameModule = require("ui/frame");
var orientationModule = require("nativescript-screen-orientation");
var UserViewModel = require("./models/users/user-view-model");
var StoresViewModel = require("./models/store/search-view-model");
var config = require("./shared/config");
var cache = require("./shared/cache");
var utils = require("./utils/utils");

exports.loaded = function (args) {

    orientationModule.setCurrentOrientation("portrait");

    var userToken = appSettings.getString("app_Token", "");

    if (userToken != "") {

        cache.token = userToken;
        cache.UserFullName = appSettings.getString("app_UserFullName", "");
        cache.selectedDate = new Date();

        StoresViewModel.GetStoresViewModel()
            .catch(function (error) {
                frameModule.topmost().navigate({ moduleName: "views/login/login", clearHistory: true });
                throw error;
            })
            .then(function (result) {
                cache.stores = result;
                cache.selectedStore = result[0];

                if (result[0].brand != 'TEA')
                    frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard", clearHistory: true });
                else
                    frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard_resto", clearHistory: true });
            });
    } else if (args.object.navigationContext == null) {
        frameModule.topmost().navigate({ moduleName: "views/login/login", clearHistory: true });
    }
    else {
        var user = new UserViewModel({
            username: args.object.navigationContext.username,
            password: args.object.navigationContext.password
        });

        user.login()
            .catch(function (error) {
                frameModule.topmost().navigate({ moduleName: "views/login/login", clearHistory: true });
                throw Error("Usuario o clave incorrecto.");
            })
            .then(function (response) {

                cache.UserFullName = response.data.name;
                cache.token = "JWT " + response.data.token;
                cache.selectedDate = new Date();

                appSettings.setString("app_Token", cache.token);
                appSettings.setString("app_UserFullName", cache.UserFullName);

                StoresViewModel.GetStoresViewModel().then(function (result) {
                    cache.stores = result;
                    cache.selectedStore = result[0];
                    frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard", clearHistory: true });
                });
            }).catch(function (error) { });
    }
};
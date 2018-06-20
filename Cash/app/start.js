var appSettings = require("application-settings");
var frameModule = require("ui/frame");
var UserViewModel = require("./models/users/user-view-model");
var StoresViewModel = require("./models/store/search-view-model");
var config = require("./shared/config");
var cache = require("./shared/cache");
var utils = require("./utils/utils");
var CONST = require("./utils/const");

var user;

exports.loaded = function (args) {

    var userToken = appSettings.getString("app_Token", "");

    if (userToken != "") {

        cache.token = userToken;
        cache.UserFullName = appSettings.getString("app_UserFullName", "");
        cache.selectedDate = new Date();

        StoresViewModel.GetStoresViewModel()
            .catch(EvalError)
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

        user = new UserViewModel({
            username: args.object.navigationContext.username,
            password: args.object.navigationContext.password
        });

        user.login()
            .catch(EvalError)
            .then(function (response) {

                cache.UserFullName = response.data.name;
                cache.token = "JWT " + response.data.token;
                cache.selectedDate = new Date();

                appSettings.setString("app_Token", cache.token);
                appSettings.setString("app_UserFullName", cache.UserFullName);

                StoresViewModel.GetStoresViewModel().then(function (result) {
                    cache.stores = result;
                    cache.selectedStore = result[0];

                    if (result[0].brand != 'TEA')
                        frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard", clearHistory: true });
                    else
                        frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard_resto", clearHistory: true });
                });
            });
    }
};

function EvalError(error) {
    var dialogsModule = require("ui/dialogs");
    switch (parseInt(error.message)) {
        case CONST.ERROR_CREDENCIALES_INVALIDAS: {
            dialogsModule.alert({
                message: "Usuario o clave incorrecto.",
                okButtonText: "OK"
            });
            frameModule.topmost().navigate({ moduleName: "views/login/login", clearHistory: true });
            break;
        }
        default: {
            dialogsModule.confirm({
                title: "No se pudo establecer la conexión con el servidor",
                message: "Verifique que su dispositivo tenga acceso a la red móvil o conexión WIFI",
                okButtonText: "Reintentar",
                cancelButtonText: "Cancelar"
            }).then(function (result) {
                var frameModule = require("ui/frame");
                if (result) {
                    if (appSettings.getString("app_Token", "") != "") {
                        frameModule.topmost().navigate({ moduleName: "start", clearHistory: true });
                    }
                    else {
                        frameModule.topmost().navigate({
                            moduleName: "start",
                            clearHistory: true,
                            context: {
                                username: user.username,
                                password: user.password
                            }
                        });
                    }
                }
                else {
                    frameModule.topmost().navigate({ moduleName: "views/login/login", clearHistory: true });
                }
            });
            break;
        }
    }
    throw error;
}
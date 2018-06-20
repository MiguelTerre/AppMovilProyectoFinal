var utils = require("../../utils/utils");
var config = require("../../shared/config");
var cache = require("../../shared/cache");
var observableModule = require("data/observable");
var appSettings = require("application-settings");

function User(info) {
    info = info || {};

    // You can add properties to observables on creation
    var viewModel = new observableModule.fromObject({
        username: info.username || "",
        password: info.password || ""
    });

    viewModel.login = function() {

        var strBody = "username=" + viewModel.get("username") + "&password=" + viewModel.get("password") + "&appname=MOBILE";

        return utils.fetchTimeOut(config.apiUrl + "login", {
            method: "POST",
            body: strBody,
            headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" }
        })
        .then(function(response) {
            if (!response.ok) {
                var dialogsModule = require("ui/dialogs");
                switch (response.status) {
                    case 401: {
                        dialogsModule.alert({
                            message: "Usuario o clave incorrecto.",
                            okButtonText: "OK"
                        });
                        break;
                    }
                    case 502: {
                        dialogsModule.alert({
                            message: "No se puede establecer la conexión con el servidor.",
                            okButtonText: "OK"
                        });
                        break;
                    }
                }
                throw response;
            }
            return response;
        })
        .then(function(response) {
            return response.json();
        })
    };

    viewModel.isValidEmail = function() {
        var username = this.get("username");
        return true; //validator.validate(email);
    };

    return viewModel;
}

module.exports = User;
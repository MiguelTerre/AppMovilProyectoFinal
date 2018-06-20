var frameModule = require("ui/frame");
var Observable = require("data/observable").Observable;
var observableModule = require("data/observable");
var config = require("../../shared/config");
var cache = require("../../shared/cache");
var utils = require("../../utils/utils");
var CONST = require("../../utils/const");
var appSettings = require("application-settings");
var dialogsModule = require("ui/dialogs");
var dashboardData = require("../../models/dashboard/dashboard-view-model");
var gestures = require("ui/gestures");

var pageData = new Observable();
var prev = 0;

require("nativescript-dom");

exports.pageLoaded = function (args) {

  const request = async () => {

    page = args.object;

    pageData.selectedStore = cache.selectedStore;
    pageData.selectedDate = utils.GetDateText(cache.selectedDate);
    pageData.userFullName = cache.UserFullName;
    page.bindingContext = pageData;

    try {
      pageData.set("busy", true);
      const data = await dashboardData.GetDashBoardData(cache.selectedStore.country, cache.selectedStore.store, cache.selectedDate);

      if (data != null)
        pageData.set("data", data);
      else
        pageData.data = null;

      pageData.set("busy", false);

    }
    catch (ex) {
      EvalError(ex);
    }
  }
  request();
};

exports.onScroll = function (args) {
  prev = args.scrollY;
}

exports.checkSwipe = function (args) {
  if (args.direction == 8 && prev <= 0){
    frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard", clearHistory: true });
  }
}
exports.onSelectedIndexChanged = function(args) {
  prev = 0;
}

exports.storeSelect = function () {
  frameModule.topmost().navigate("views/stores/selectstore");
}

exports.dateSelect = function () {
  frameModule.topmost().navigate("views/calendar/calendar");
}

exports.EndSession = function () {
  appSettings.setString("app_Token", "");
  frameModule.topmost().navigate("start");
}

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
          frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard", clearHistory: true });
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
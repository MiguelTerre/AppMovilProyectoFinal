var frameModule = require("ui/frame");
var Observable = require("data/observable").Observable;
var observableModule = require("data/observable");
var config = require("../../shared/config");
var cache = require("../../shared/cache");
var utils = require("../../utils/utils");
var appSettings = require("application-settings");
var dialogsModule = require("ui/dialogs");
var dashboardData = require("../../models/dashboard/dashboard-view-model");

var pageData = new Observable();

exports.pageLoaded = function (args) {

  const request = async () => {

    page = args.object;

    pageData.selectedStore = cache.selectedStore;
    pageData.selectedDate = utils.GetDateText(cache.selectedDate);
    pageData.userFullName = cache.UserFullName;

    const data = await dashboardData.GetDashBoardData(cache.selectedStore.country, cache.selectedStore.store, cache.selectedDate);

    pageData.data = data;
    pageData.set("busy", false);
    
    page.bindingContext = pageData;

  }
  request();
};

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
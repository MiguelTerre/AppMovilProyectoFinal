var frameModule = require("ui/frame");
var Observable = require("data/observable").Observable;
var observableModule = require("data/observable");
var config = require("../../shared/config");
var cache = require("../../shared/cache");

var pageData = new Observable();

exports.pageLoaded = function (args) {

    page = args.object;
    pageData.stores = cache.stores;
    page.bindingContext = pageData;

};

exports.onItemTap = function (args) {
    cache.selectedStore = pageData.stores[args.index];
    if (pageData.stores[args.index].brand != 'TEA')
        frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard", clearHistory: true });
    else
        frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard_resto", clearHistory: true });
}
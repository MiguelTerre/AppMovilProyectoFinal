var config = require("../../shared/config");
var utils = require("../../utils/utils");
var ObservableArray = require("data/observable-array").ObservableArray;
var cache = require("../../shared/cache");

module.exports = {

    GetStoresViewModel() {

        var result = new Array();

        return utils.fetchTimeOut(config.apiUrl + "v1/store/search", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8", "Authorization": cache.token }
        }).then(function (response) {
            response.data.forEach(function (store) {
                result.push({
                    brand: store.brand,
                    country: store.country,
                    store: store.store,
                    name: store.name,
                    appname: store.appname
                });
            });
            return result;
        });
    }
}

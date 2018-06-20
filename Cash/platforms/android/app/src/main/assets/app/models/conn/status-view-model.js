var config = require("../../shared/config");
var utils = require("../../utils/utils");
var ObservableArray = require("data/observable-array").ObservableArray;
var cache = require("../../shared/cache");

module.exports = {

    GetConnStatusStoreViewModel(store) {

        var result = new Object();
                
        return utils.fetchTimeOut(config.apiUrl + "v1/conn/status", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8", "Authorization": cache.token },
            body: JSON.stringify({ "store": store })
        })
        .then(function (response) {
                if (!response.ok) {
                    throw response;
                }
                return response;
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {

                if (response.data == null || response.data.length == 0)
                    return null;

                result.brand = response.data[0].brand;
                result.country = response.data[0].country;
                result.store = response.data[0].store;
                result.name = response.data[0].name;
                result.public_address = response.data[0]["public-address"];
                result.private_address = response.data[0]["private-address"];
                result.last_connection = utils.parseDateTime(response.data[0]["last-connection"]);
                result.seconds_from_last = response.data[0]["seconds-from-last"];

                return result;

            });
    }
}

var config = require("../../shared/config");
var utils = require("../../utils/utils");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;
var cache = require("../../shared/cache");

module.exports = {

    GetCalendarDaysViewModel(country, store, year, month) {

        var result = new Object();
        var days = new Array();

        return utils.fetchTimeOut(config.apiUrl + "v1/calendar/search", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8", "Authorization": cache.token },
            body: JSON.stringify({
                country: country,
                store: store,
                year: year,
                month: month
            })
        }).then(function (response) {

            response.data.days.forEach(function (day) {
                days.push({
                    day: day.day,
                    status: day.status
                });
            });

            result.country = response.data.country;
            result.store = response.data.store;
            result.year = response.data.year;
            result.month = response.data.month;
            result.days = days;

            return result;

        });
    },
}

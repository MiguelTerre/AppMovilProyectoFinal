var config = require("../../shared/config");
var utils = require("../../utils/utils");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;
var cache = require("../../shared/cache");

module.exports = {

    GetDayPartSalesViewModel(country, store, business_date, sale_area) {

        var result = new Array();

        var body = JSON.stringify({ country: country, store: store, "business-date": business_date, "sale-area": sale_area });

        if (sale_area == "" || sale_area == null)
            body = JSON.stringify({ country: country, store: store, "business-date": business_date });

        return utils.fetchTimeOut(config.apiUrl + "v1/store/daypartsales", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8", "Authorization": cache.token },
            body: body
        }).then(function (response) {
            response.data.forEach(function (sale) {

                if (parseFloat(sale.amount) != 0) {
                    result.push({
                        daypart: sale.daypart,
                        amount: parseFloat(sale.amount) / 100,
                        amount_str: utils.currencyFormat(parseFloat(sale.amount) / 100),
                        qty: parseInt(sale.qty),
                        avg_qty: parseFloat(sale["avg-qty"]) / 100,
                        avg_qty_str: utils.currencyFormat(parseFloat(sale["avg-qty"]) / 100),
                        seats: parseInt(sale.seats),
                        avg_seats: parseFloat(sale["avg-seats"]) / 100,
                        avg_seats_str: utils.currencyFormat(parseFloat(sale["avg-seats"]) / 100),
                    });
                }
            });

            return result;

        });
    }
}

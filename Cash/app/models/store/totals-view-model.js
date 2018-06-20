var config = require("../../shared/config");
var utils = require("../../utils/utils");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;
var cache = require("../../shared/cache");

module.exports = {

    GetTotalStoresViewModel(country, store, business_date, sale_area) {

        var result = new Object();

        var body = JSON.stringify({ country: country, store: store, "business-date": business_date, "sale-area": sale_area });

        if (sale_area == "" || sale_area == null)
            body = JSON.stringify({ country: country, store: store, "business-date": business_date });

        return utils.fetchTimeOut(config.apiUrl + "v1/store/totals", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8", "Authorization": cache.token },
            body: body
        }).then(function (response) {
                
                result.amount = parseFloat(response.data.amount) / 100;
                result.amount_str = utils.currencyFormat(result.amount);
                result.qty = parseInt(response.data.qty);
                result.avg_qty = parseFloat(response.data["avg-qty"]) / 100;
                result.avg_qty_str = utils.currencyFormat(result.avg_qty);
                result.seats = parseInt(response.data.seats);
                result.avg_seats = parseFloat(response.data["avg-seats"]) / 100;
                result.avg_seats_str = utils.currencyFormat(result.avg_seats);
                result.sale_amount = parseFloat(response.data["sale-amount"]) / 100;
                result.sale_amount_str = utils.currencyFormat(result.sale_amount);
                result.sale_gty = parseInt(response.data["sale-qty"]);
                result.refund_amount = parseFloat(response.data["refund-amount"]) / 100;
                result.refund_amount_str = utils.currencyFormat(result.refund_amount);
                result.refund_qty = parseInt(response.data["refund-qty"]);
                result.sp_amount = parseFloat(response.data["sp-amount"]) / 100;
                result.sp_amount_str = utils.currencyFormat(result.sp_amount);
                result.sp_qty = parseInt(response.data["sp-qty"]);

                return result;
            });
    }
}

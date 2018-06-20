var fetchModule = require("fetch");
var config = require("../../shared/config");
var utils = require("../../utils/utils");
var cache = require("../../shared/cache");
var totalStoresViewModel = require("../store/totals-view-model");
var hourlySalesViewModel = require("../store/hourlysales-view-model");
var daypartSalesViewModel = require("../store/daypartsales-view-model");
var connStatusSalesViewModel = require("../conn/status-view-model");

module.exports = {

    GetDashBoardData(country, store, business_date) {

        var data = new Object();
        var dateString = utils.ParseDateToISO(business_date);

        const request = async () => {

            const conn_status = await connStatusSalesViewModel.GetConnStatusStoreViewModel(store);
            
            if (conn_status != null)
                data.conn_status = conn_status;
            
            const totals = await totalStoresViewModel.GetTotalStoresViewModel(country, store, dateString, null);

            if (totals.amount == 0)
                return null;

            data.totals = totals;

            const hourly_sales = await hourlySalesViewModel.GetHourlySalesViewModel(country, store, dateString);
            data.hourly_sales = hourly_sales;

            const daypart_sales = await daypartSalesViewModel.GetDayPartSalesViewModel(country, store, dateString);
            data.daypart_sales = daypart_sales;

            //Si hay cubiertos, es porque es un restaurant. Vuelvo a traer todo pero por salon
            if (data.totals.seats > 0) {

                const totals_resto = await totalStoresViewModel.GetTotalStoresViewModel(country, store, dateString, "salon");
                data.totals_resto = totals_resto;

                const hourly_sales_resto = await hourlySalesViewModel.GetHourlySalesViewModel(country, store, dateString, "salon");
                data.hourly_sales_resto = hourly_sales_resto;

                const daypart_sales_resto = await daypartSalesViewModel.GetDayPartSalesViewModel(country, store, dateString, "salon");
                data.daypart_sales_resto = daypart_sales_resto;
            }
            return data;
        }
        return request();
    }
}

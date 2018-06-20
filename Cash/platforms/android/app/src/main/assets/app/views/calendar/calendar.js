var frameModule = require("ui/frame");
var Observable = require("data/observable").Observable;
var observableModule = require("data/observable");
var config = require("../../shared/config");
var CalendarSearchViewModel = require("../../models/calendar/search-view-model");
var cache = require("../../shared/cache");
var utils = require("../../utils/utils");
var appSettings = require("application-settings");

var pageData = new Observable();

require("nativescript-dom");

exports.pageLoaded = function (args) {

    var page = args.object;
    pageData.set("busy", true);
    page.bindingContext = pageData;

    if (cache.calendarDate == null)
        cache.calendarDate = cache.selectedDate;

    CalendarSearchViewModel.GetCalendarDaysViewModel(
        cache.selectedStore.country,
        cache.selectedStore.store,
        cache.calendarDate.getFullYear(),
        cache.calendarDate.getMonth() + 1
    ).then(function (result) {
        var stackLayout = page.getElementById('layoutCalendar');
        var lblMesAnioActual = page.getElementById('lblMesAnioActual');
        lblMesAnioActual.text = utils.GetMonthFullName(cache.calendarDate.getMonth()) + " - " + cache.calendarDate.getFullYear();
        var grid = utils.GetCalendarByDays(result);
        
        stackLayout.removeChildren();
        stackLayout.addChild(grid);
        pageData.set("busy", false);
    });
};

exports.MonthBack = function (args) {

    var page = args.object.page;
    pageData.set("busy", true);

    var mesActual = cache.calendarDate.getMonth();
    var anioActual = cache.calendarDate.getFullYear();

    mesActual--;
    if (mesActual < 0) {
        mesActual = 11;
        anioActual--;
    }

    cache.calendarDate = new Date(anioActual, mesActual, 1);

    CalendarSearchViewModel.GetCalendarDaysViewModel(
        cache.selectedStore.country,
        cache.selectedStore.store,
        cache.calendarDate.getFullYear(),
        cache.calendarDate.getMonth() + 1
    ).then(function (result) {
        var stackLayout = page.getElementById('layoutCalendar');
        var grid = utils.GetCalendarByDays(result);

        var lblMesAnioActual = page.getElementById('lblMesAnioActual');
        lblMesAnioActual.text = utils.GetMonthFullName(cache.calendarDate.getMonth()) + " - " + cache.calendarDate.getFullYear();

        stackLayout.removeChild(stackLayout.getChildAt(0));
        stackLayout.addChild(grid);
        pageData.set("busy", false);
    });

};

exports.MonthForward = function (args) {

    var page = args.object.page;
    pageData.set("busy", true);

    var mesActual = cache.calendarDate.getMonth();
    var anioActual = cache.calendarDate.getFullYear();

    mesActual++;
    if (mesActual < 0) {
        mesActual = 0;
        anioActual++;
    }

    cache.calendarDate = new Date(anioActual, mesActual, 1);

    CalendarSearchViewModel.GetCalendarDaysViewModel(
        cache.selectedStore.country,
        cache.selectedStore.store,
        cache.calendarDate.getFullYear(),
        cache.calendarDate.getMonth() + 1
    ).then(function (result) {
        var stackLayout = page.getElementById('layoutCalendar');
        var grid = utils.GetCalendarByDays(result);

        var lblMesAnioActual = page.getElementById('lblMesAnioActual');
        lblMesAnioActual.text = utils.GetMonthFullName(cache.calendarDate.getMonth()) + " - " + cache.calendarDate.getFullYear();

        stackLayout.removeChild(stackLayout.getChildAt(0));
        stackLayout.addChild(grid);
        pageData.set("busy", false);
    });
};

exports.SelectToday = function (args) {
    cache.calendarDate = new Date();
    cache.selectedDate = new Date();

    if (cache.selectedStore.brand != 'TEA')
        frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard", clearHistory: true });
    else
        frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard_resto", clearHistory: true });
};



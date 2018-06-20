var CONST = require("./const");

module.exports = {

    fetchTimeOut(string, RequestInit) {

        var promise = new fetch(string, RequestInit);

        return new Promise(function (resolve, reject) {
            var to = setTimeout(function () {
                var dialogsModule = require("ui/dialogs");
                var frameModule = require("ui/frame");
                dialogsModule.alert({
                    message: "No se pudo establecer la conexión con el servidor",
                    okButtonText: "OK"
                });
                frameModule.topmost().navigate({ moduleName: "views/login/login", clearHistory: true });
                reject(new Error("Connection timed out"));
            }, CONST.FETCH_TIMEOUT);
            promise.then(resolve, reject).then(function () {
                clearTimeout(to)
            });
        });
    },

    handleErrors(response) {
        if (!response.ok) {
            console.log(JSON.stringify(response));
            throw Error(response.statusText);
        }
        return response;
    },

    numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return parts.join(",");
    },

    currencyFormat(num) {
        return num.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    },

    parseDate(str) {
        var y = str.substr(0, 4),
            m = str.substr(4, 2) - 1,
            d = str.substr(6, 2);
        var D = new Date(y, m, d);
        return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) ? D : 'invalid date';
    },

    parseDateTime(str) {
        var y = str.substr(0, 4),
            m = str.substr(4, 2) - 1,
            d = str.substr(6, 2),
            h = str.substr(8, 2),
            mi = str.substr(10, 2),
            s = str.substr(12, 2);

        var D = new Date(y, m, d, h, mi, s);
        return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) ? D : 'invalid date';
    },

    GetMonthName(month) {
        return this.GetMonthFullName(month).substr(0, 3);
    },

    GetMonthFullName(month) {
        var months = new Array("ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE");
        return months[month];
    },

    GetDateText(date) {
        var month = this.GetMonthName(date.getMonth());
        return date.getDate() + '-' + month + '-' + date.getFullYear();
    },

    ParseDateToISO(date) {
        return date.toISOString().replace("-", "").replace("-", "").substring(0, 8);
    },

    GetCalendarByDays(response) {//Retorna un GridLayout

        var LabelModule = require("tns-core-modules/ui/label");
        var ButtonModule = require("tns-core-modules/ui/button");
        var GridLayoutModule = require("tns-core-modules/ui/layouts/grid-layout");
        var SpanModule = require("tns-core-modules/text/span");
        var FormattedStringModule = require("tns-core-modules/text/formatted-string");
        var cache = require("../shared/cache");


        var grid = new GridLayoutModule.GridLayout();
        var column1 = new GridLayoutModule.ItemSpec(1, "star");
        var column2 = new GridLayoutModule.ItemSpec(1, "star");
        var column3 = new GridLayoutModule.ItemSpec(1, "star");
        var column4 = new GridLayoutModule.ItemSpec(1, "star");
        var column5 = new GridLayoutModule.ItemSpec(1, "star");
        var column6 = new GridLayoutModule.ItemSpec(1, "star");
        var column7 = new GridLayoutModule.ItemSpec(1, "star");

        grid.addColumn(column1);
        grid.addColumn(column2);
        grid.addColumn(column3);
        grid.addColumn(column4);
        grid.addColumn(column5);
        grid.addColumn(column6);
        grid.addColumn(column7);

        var row = new GridLayoutModule.ItemSpec(1, "auto");

        var actualRow = 0;
        var actualCol = 0;

        //verifico el primer día que llega que dia de la semana cae
        if (response.days != null && response.days.length > 0) {
            var fecha = new Date(response.year, response.month - 1, response.days[0].day);
            actualCol = fecha.getDay();
        }

        var fechaHoy = new Date();
        response.days.forEach(day => {

            var fechaActual = new Date(response.year, response.month - 1, day.day);
            var button = new ButtonModule.Button();

            var spanDay = new SpanModule.Span();
            var spanStatus = new SpanModule.Span();

            spanDay.text = day.day + "\n";
            spanDay.className = "spnDayNumber";

            //texto del calendario
            switch (day.status)
            {
                case "": spanStatus.text = CONST.STATUS_DAY_NODATA;break;
                case "OPENED": spanStatus.text = CONST.STATUS_DAY_OPENED;break;
                case "CLOSED": spanStatus.text = CONST.STATUS_DAY_CLOSED;break;
            }
            
            spanStatus.className = "spnDayStatus";

            button.formattedText = new FormattedStringModule.FormattedString();
            button.formattedText.spans.push(spanDay);
            button.formattedText.spans.push(spanStatus);

            //Estilos dependiendo del estado y dia del boton del calendario
            if (cache.selectedDate.getDate() == day.day &&
                cache.selectedDate.getMonth() + 1 == response.month &&
                cache.selectedDate.getFullYear() == response.year) {
                button.className = "btnCalendarDay btnSelectedDate";
                spanStatus.className = "spnDayStatus";
                spanDay.className = "spnDayNumber";
            }
            else if (fechaHoy.getDate() == day.day &&
                fechaHoy.getMonth() + 1 == response.month &&
                fechaHoy.getFullYear() == response.year) {
                button.className = "btnCalendarDay btnTodayDate";
                spanStatus.className = "spnDayStatus";
                spanDay.className = "spnDayNumber";
            }
            else {
                button.className = "btnCalendarDay";
                switch (day.status) {
                    case "CLOSED": {
                        spanStatus.className = "spnDayStatus dayClosed";
                        spanDay.className = "spnDayNumber dayClosed";
                        break;
                    }
                    case "OPENED": {
                        spanStatus.className = "spnDayStatus dayOpened";
                        spanDay.className = "spnDayNumber dayOpened";
                        break;
                    }
                }
            }

            button.row = actualRow;
            button.col = actualCol;
            button.fecha = fechaActual;

            button.on(ButtonModule.Button.tapEvent, function (args) {
                var cache = require("../shared/cache");
                var frameModule = require("ui/frame");
                cache.calendarDate = args.object.fecha;
                cache.selectedDate = args.object.fecha;

                if (cache.selectedStore.brand != 'TEA')
                    frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard", clearHistory: true });
                else
                    frameModule.topmost().navigate({ moduleName: "views/dashboard/dashboard_resto", clearHistory: true });

            });

            grid.addChild(button);

            actualCol++;

            if (actualCol % 7 == 0 || day.day == response.days.length) {
                grid.addRow(row);
                row = new GridLayoutModule.ItemSpec(1, "auto");

                actualRow++;
                actualCol = 0;
            }
        });

        return grid;
    }
}
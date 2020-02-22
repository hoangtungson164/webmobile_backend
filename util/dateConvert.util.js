const dateFormat = require('dateformat');

module.exports = {
    formatDate: function (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hh = '' + d.getHours(),
            mm = '' + d.getMinutes(),
            ss = '' + d.getSeconds();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return year + month + day + hh + mm + ss;
    },

    timeStamp: function () {
        var timeStamp = dateFormat(new Date(), "yyyymmddHHMMss");
        
        return timeStamp;
    },

    timeStamp2: function () {
        var timeStamp = dateFormat(new Date(), "yyyymmddHHMMl");
        
        return timeStamp;
    },

    getSeconds: function(start) {
        return ((new Date() - start) % 60000 / 1000).toFixed(2) + "s";
    }
};
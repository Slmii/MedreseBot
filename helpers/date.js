const moment = require('moment');
moment.locale('nl');

const formatDate = ({ date, dateFormat }) => {
    return moment(date, ['DD.MM.YYYY', 'DD-MM-YYYY', 'DDMMYYYY']).format(dateFormat);
};

const formatEidDate = ({ date, dateFormat }) => {
    return moment(date, 'DD MMMM YYYY dddd', 'tr').locale('nl').format(dateFormat)
};

module.exports = {
    formatDate,
    formatEidDate
};
    
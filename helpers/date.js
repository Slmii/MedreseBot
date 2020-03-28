const moment = require('moment');
moment.locale('nl');

const formatDate = ({ date, dateFormat }) => {
    return moment(date, ['DD.MM.YYYY', 'DD-MM-YYYY', 'DDMMYYYY']).format(dateFormat);
};

module.exports = {
    formatDate
};
    
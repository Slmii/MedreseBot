require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');

const { formatDate } = require('./date');

const finCity = (cities, cityToFind) => {
    cityToFind = cityToFind.toLowerCase();
    const city = cities.find(({ IlceAdiEn, IlceAdi }) => IlceAdiEn.replace(' ', '').toLowerCase() === cityToFind || IlceAdi.replace(' ', '').toLowerCase() === cityToFind)
    return city;
};

const getPrayerTimes = async ({ cityId, date }) => {
    try {
        const response = await fetch(`https://ezanvakti.herokuapp.com/vakitler?ilce=${cityId}`);
        const data     = await response.json();

        // If date is not defined then always get the prayer times for today
        if (!date) {
            return data[0];
        }

        const dateToFind = formatDate({ date, dateFormat: 'DD-MM-YYYY' });

        // Find and return the prayer time for the given date
        return data.find(prayer => {
            const prayerDate = formatDate({ date: prayer.MiladiTarihKisaIso8601, dateFormat: 'DD-MM-YYYY' });
            return prayerDate === dateToFind;
        });
    } catch (error) {
        console.log(error);
        return error;
    }
};

const getEidTimes = async ({ cityId }) => {
    try {
        const response = await fetch(`https://ezanvakti.herokuapp.com/bayram?ilce=${cityId}`);
        const data     = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

module.exports = {
    finCity,
    getPrayerTimes,
    getEidTimes
};
    
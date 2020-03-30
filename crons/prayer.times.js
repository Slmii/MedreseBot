const cron = require('cron');

const { finCity, getPrayerTimes } = require('../helpers/prayer.times');
const { setEmbed }       = require('../helpers/embed');
const { formatDate }     = require('../helpers/date');
const { cities }         = require('../data/prayer.time.cities');

const cronPrayerTimes = (client, cityToFind) => {
    const cronjob = new cron.CronJob('00 00 08 * * *', async () => {
        if (!client.guilds.cache.size) {
            return;
        }
        
        const guild = client.guilds.cache.find(guild => guild.id === '690300114375409734');
        if (!guild) {
            return;
        }

        // Find city
        const city = finCity(cities, cityToFind);

        // Deconstruct valus from the city object
        const { IlceID: cityId, IlceAdiEn: cityName } = city;

        // If there is more than 1 argument, then the date from/to are given
        // Get prayer times from a specific city
        const prayerTime = await getPrayerTimes({ cityId });

        // If there is no date(s) from/to then get by default the prayer times from today
        const embed = setEmbed({
            title: `Gebedstijden voor \`${cityName.toLowerCase()}\``,
            fields: [
                {
                    name: ':calendar_spiral: Datum',
                    value: formatDate({ 
                        date: prayerTime.MiladiTarihKisaIso8601, 
                        dateFormat: 'dd, D MMMM, gggg' 
                    }),
                    inline: true
                },
                {
                    name: ':kaaba: Hijri',
                    value: prayerTime.HicriTarihUzun,
                    inline: true
                },
                {
                    name: 'Fajr',
                    value: `**${prayerTime.Imsak}**`
                },
                {
                    name: 'Zonsopkomst',
                    value: `**${prayerTime.Gunes}**`
                },
                {
                    name: 'Dhuhr',
                    value: `**${prayerTime.Ogle}**`
                },
                {
                    name: 'Asr',
                    value: `**${prayerTime.Ikindi}**`
                },
                {
                    name: 'Maghrib',
                    value: `**${prayerTime.Aksam}**`
                },
                {
                    name: 'Isha',
                    value: `**${prayerTime.Yatsi}**`
                },

            ],
            footer: {
                text: `${guild.name} | Discord ID: ${client.user.id}`,
                iconURL: guild.iconURL()
            }
        });

        client.channels.cache.find(({ name }) => name === `gebedstijden-${cityName.toLowerCase()}`).send(embed);
    }, null, false, 'Europe/Amsterdam');

    return cronjob;
};

module.exports = {
    cronPrayerTimes
};
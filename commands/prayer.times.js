const { setEmbed }                = require('../helpers/embed');
const { formatDate }              = require('../helpers/date');
const { finCity, getPrayerTimes } = require('../helpers/prayer.times');
const { cities }                  = require('../data/prayer.time.cities');

const COMMAND_NAME = 'gebedstijden';
const countries = [
    'Nederland',
    'Belgie',
    'Turkije'
];

module.exports = {
    active: true,
    name: COMMAND_NAME,
    description: `Toon gebedstijden van vandaag of van een aangegeven datum in de toekomst. Datum mag maximaal 30 dagen in de toekomst zijn. Zonder een aangegeven datum worden de tijden altijd van vandaag weergeven.\n\n**Gebruik geen spaties voor plaatsen die bestaan uit meerdere woorden.**\n\nBeschikbaar voor de volgende landen: \n${countries.map(country => `* ${country}`).join('\n')}`,
    args: true,
    minArgs: 1,
    maxArgs: 2,
    usages: [
        `${COMMAND_NAME} <plaats> [dd.mm.yyyy]`,
    ],
    examples: [
        `${COMMAND_NAME} emmen`,
        `${COMMAND_NAME} emmen 05.01.2020`,
        `${COMMAND_NAME} denhaag 05.01.2020`,
        `${COMMAND_NAME} denhelder 05.01.2020`
    ],
    aliases: [
        'prayertimes',
        'prayer',
        'gebed'
    ],
    cooldown: 20,
	async execute(message, args) {
        const cityToFind = args[0].toLowerCase().trim();
        const city       = finCity(cities, cityToFind);

        if (!city) {
            const embed = setEmbed({
                title: `De stad \`${cityToFind}\` is niet gevonden. Kies een stad in Nederland/Belgie/Turkije.`
            });
    
            return message.channel.send(embed);
        }

        // Deconstruct valus from the city object
        let { IlceID: cityId, IlceAdiEn: cityName } = city;
        cityName = cityName.toLowerCase();

        // If there is more than 1 argument, then the date from/to are given
        // Get prayer times from a specific city
        const prayerTime = await getPrayerTimes({ 
            cityId, 
            date: args[1], 
        });

        if (!prayerTime) {
            const embed = setEmbed({
                title: 'De gekozen datum is niet gevonden. Kies een datum tot maximaal 30 dagen in de toekomst.'
            });
    
            return message.channel.send(embed);
        }
        
        if (prayerTime.message) {
            const embed = setEmbed({
                title: 'De aantal verzoeken zijn overschreden, wacht 15 minuten voordat je een nieuwe verzoek indient.'
            });
    
            return message.channel.send(embed);
        }

        // If there is no date(s) from/to then get by default the prayer times from today
        const embed = setEmbed({
            title: `Gebedstijden voor \`${cityName}\``,
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
                    name: ':mosque: Hijri',
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
                text: `${message.guild.name} | Discord ID: ${message.guild.member(message.author).user.id}`,
                iconURL: message.guild.iconURL()
            }
        });

        return message.channel.send(embed);
	}
};
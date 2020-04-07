const moment = require('moment');

const { setEmbed }             = require('../helpers/embed');
const { formatEidDate }        = require('../helpers/date');
const { finCity, getEidTimes } = require('../helpers/prayer.times');
const { cities }               = require('../data/prayer.time.cities');

const COMMAND_NAME = 'eid';
const countries = [
    'Nederland',
    'Belgie',
    'Turkije'
];

module.exports = {
    active: true,
    name: COMMAND_NAME,
    description: `Toon Eid gebedstijden van dit jaar van een aangegeven stad.\n\nBeschikbaar voor de volgende landen: \n${countries.map(country => `* ${country}`).join('\n')}`,
    args: true,
    minArgs: 1,
    maxArgs: 2,
    usages: [
        `${COMMAND_NAME} <plaats>`,
    ],
    examples: [
        `${COMMAND_NAME} emmen`,
        `${COMMAND_NAME} denhaag`,
    ],
    aliases: [
        'bayram',
        'suikerfeest'
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
        const eidTimes = await getEidTimes({ 
            cityId
        });
        
        if (eidTimes.message) {
            const embed = setEmbed({
                title: 'De aantal verzoeken zijn overschreden, wacht 15 minuten voordat je een nieuwe verzoek indient.'
            });
    
            return message.channel.send(embed);
        }

        const embed = setEmbed({
            title: `Eid gebedstijden voor \`${cityName}\``,
            fields: [
                {
                    name: '**Eid al-Fitr**',
                    value: ':mosque:\u200B',
                    inline: true
                },
                {
                    name: 'Datum',
                    value: formatEidDate({ 
                        date: eidTimes.RamazanBayramNamaziTarihi, 
                        dateFormat: 'dd, D MMM, gggg' 
                    }),
                    inline: true
                },
                {
                    name: 'Tijd',
                    value: eidTimes.RamazanBayramNamaziSaati,
                    inline: true
                },
                {
                    name: '**Eid al-Adha**',
                    value: ':goat:\u200B',
                    inline: true
                },
                {
                    name: 'Datum',
                    value: formatEidDate({ 
                        date: eidTimes.KurbanBayramNamaziTarihi, 
                        dateFormat: 'dd, D MMM, gggg' 
                    }),
                    inline: true
                },
                {
                    name: 'Tijd',
                    value: eidTimes.KurbanBayramNamaziSaati,
                    inline: true
                }
            ],
            footer: {
                text: `${message.guild.name} | Discord ID: ${message.guild.member(message.author).user.id}`,
                iconURL: message.guild.iconURL()
            }
        });

        return message.channel.send(embed);
	}
};
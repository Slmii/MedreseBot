const fs     = require('fs');
const xml2js = require('xml2js');

const { setEmbed, setErrorEmbed } = require('../helpers/embed');

const surahData  = {};

(async () => {
    const dataItems = ['index', 'start', 'ayas', 'name', 'tname', 'ename', 'type', 'rukus'];
    const xml       = fs.readFileSync(`${__dirname}/../data/quran/quran.xml`, 'utf8');
    const { quran } = await xml2js.parseStringPromise(xml);

    for (let i = 1; i <= 114; i++) 
    {
        const j = quran.suras[0].sura[i - 1];
        surahData[i] = {};
        dataItems.forEach(item => surahData[i][item] = j['$'][item]);
    }
})();

const COMMAND_NAME = 'quran';
const maxAyahs = 5;
const languages = [
    {
        name: 'Engels',
        abbr: 'en'
    },
    {
        name: 'Arabisch',
        abbr: 'ar'
    },
    {
        name: 'Turks',
        abbr: 'tr'
    }
];

module.exports = {
    active: true,
    name: COMMAND_NAME,
    description: `Surahs en Ayahs uit de Quran. Standaard taal is in het Engels. Maximaal ${maxAyahs} Ayahs. \nBeschikbaar in de volgende talen: \n${languages.map(({ name, abbr }) => `* ${abbr} (${name})`).join('\n')}`,
    args: true,
    maxArgs: 2,
    usages: [
        `${COMMAND_NAME} <Surah>:<Ayah>-[tot-Ayah] [taal]`
    ],
    examples: [
        `${COMMAND_NAME} 1:1`,
        `${COMMAND_NAME} 1:1-5`,
        `${COMMAND_NAME} 1:1 ar`,
        `${COMMAND_NAME} 1:1-5 ar`,
    ],
    aliases: [
        'koran'
    ],
	async execute(message, args) {
        const errorEmbed = setErrorEmbed({ usages: this.usages, examples: this.examples, prefix: true })
        
        let [surahNr, ayahNr] = args[0].split(':');
        const language        = args[1];

        // If no Ayah has been given
        if (isNaN(surahNr) || !ayahNr) {    
            return message.channel.send(errorEmbed);  
        }

        // Deconstruct
        let [ayahFromNr, ayahToNr] = ayahNr.split('-');

        if (ayahToNr) {
            if (isNaN(ayahFromNr) || isNaN(ayahToNr) || Number(ayahToNr) <= Number(ayahFromNr)) {
                return message.channel.send(errorEmbed);  
            }
            if ((Number(ayahToNr) - Number(ayahFromNr)) > maxAyahs) {
                const embed = setEmbed({
                    title: `Gebruik maximaal ${maxAyahs} Ayahs`
                });

                return message.channel.send(embed);
            }
        } else if (isNaN(ayahNr)) {
            return message.channel.send(errorEmbed);  
        }

        let quranText = '';
        try {
            // Convert entire file into an array
            quranText = fs.readFileSync(`${__dirname}/../data/quran/quran.${!language ? 'en' : `${language}`}.txt`, 'utf-8').split('\n');
        } catch (error) {
            // The file doesnt exists yet for the choosen country
            const embed = setEmbed({
                title: 'De gekozen taal is helaas nog niet beschikbaar.'
            });

            return message.channel.send(embed);
        }

        // If invalid numbers than set defaults
        if (surahNr < 1)   surahNr = 1;
        if (surahNr > 144) surahNr = 114;

        // Get starting position and end position. These will be used to slice the correct indexes for the Surah content
        const startAyah = surahData[surahNr].start;
        const endAyah   = startAyah + surahData[surahNr].ayas;

        // Get the Surah indexes
        const surah = quranText.slice(startAyah, endAyah);

        let fields = null;

        // If a range is given
        if (ayahToNr) {
            // Get the specific Ayahs indexes from the Surah and filter out the empty values. This in case the range of ayah exceeds the actual existing ayahs
            const ayahs = surah.slice(ayahFromNr - 1, ayahToNr).filter(ayah => ayah);

            fields = ayahs.map(ayah => ({
                // Increment the ayahFromNr so we can show the correct number of Ayah
                name: `Ayah: ${ayahFromNr++}`,
                value: ayah
            }));
        } else {
            // Get the specific Ayah index
            let ayah = (ayahNr == 1 && surahNr != 1 && surahNr != 9) 
                       ? surah[ayahNr - 1].replace(/^(([^ ]+ ){4})/u, '') 
                       : surah[ayahNr - 1];

            fields = [
                {
                    name: `Ayah: ${ayahNr}`,
                    value: ayah
                }
            ]
        }

        const embed = setEmbed({
            title: `${surahData[surahNr].ename} | ${surahData[surahNr].tname} | سورة ${surahData[surahNr].name}`,
            fields,
            footer: {
                text: `${message.guild.name} | Discord ID: ${message.guild.member(message.author).user.id}`,
                iconURL: message.guild.iconURL()
            }
        });

        return message.channel.send(embed);
	}
};
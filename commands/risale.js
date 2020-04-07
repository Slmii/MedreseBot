require('es6-promise').polyfill();
const fetch      = require('isomorphic-fetch');
const HTMLParser = require('node-html-parser');

const { setEmbed } = require('../helpers/embed');

const COMMAND_NAME = 'zoekrisale';

module.exports = {
    active: true,
    name: COMMAND_NAME,
    description: 'Zoek naar stukken tekst uit de Risale-i Nur.',
    args: true,
    minArgs: 1,
    usages: [
        `${COMMAND_NAME} <zoekopdracht>`,
    ],
    examples: [
        `${COMMAND_NAME} tweede woord`
    ],
    aliases: [
        'searchrisale'
    ],
	async execute(message, args) {
        const searchQuery = args.map(arg => arg).join(' ').toLowerCase().trim();

        const response = await fetch(`https://zoekrisale.nl/index.php?search=${searchQuery}`);
        const data     = await response.text();

        const root = HTMLParser.parse(data);

        const foundElements = root.querySelectorAll('[data-id]');

        if (!foundElements.length) {
            const embed = setEmbed({
                title: `Geen resultaten gevonden voor \`${searchQuery}\`.`
            });
    
            return message.channel.send(embed);
        }

        let fields = [];
        foundElements.forEach(element => {
            const title = element.firstChild;
            const text  = element.lastChild.innerHTML
                          .replace(/<b>|<\/b>/g, '**')
                          .replace(/\r\n/g, ' ');

            fields.push({
                name: `**${title.innerHTML.split(' | ')[0]}**\n${title.innerHTML.split(' | ')[1]}:`,
                value: `[${text}](${title.getAttribute('href')})`
            });
        });

        const embed = setEmbed({
            title: `Gezocht naar \`${searchQuery}\`.`,
            description: 'Klik op een link om de juiste pagina in PDF te openen.',
            fields,
            message
        });

        return message.channel.send(embed);
	}
};
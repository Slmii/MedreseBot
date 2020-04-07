require('es6-promise').polyfill();
const fetch      = require('isomorphic-fetch');
const HTMLParser = require('node-html-parser');

const { setEmbed } = require('../helpers/embed');

const COMMAND_NAME = 'zoekrisale';

module.exports = {
    active: true,
    name: COMMAND_NAME,
    description: 'Zoek naar stukken in de Risale-i Nur.',
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

        const foundElement = root.querySelector('[target="_blank"]');

        if (!foundElement) {
            const embed = setEmbed({
                title: `Geen resultaten gevonden voor \`${searchQuery}\`.`
            });
    
            return message.channel.send(embed);
        }

        const embed = setEmbed({
            title: `Gezocht naar \`${searchQuery}\`.`,
            fields: [
                {
                    name: 'Lees online as PDF',
                    value: `[${foundElement.innerHTML}](${foundElement.getAttribute('href')})`
                }
            ],
            message
        });

        return message.channel.send(embed);
	}
};
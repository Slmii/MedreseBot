const { setEmbed } = require('../helpers/embed');
const { renderReadBooksFields } = require('../helpers/books');

const COMMAND_NAME = 'boeken';

module.exports = {
    active: true,
    name: COMMAND_NAME,
    description: 'Een lijst van alle URLs waar de boeken online gelezen kunnen worden.',
    args: false,
    usages: [
        COMMAND_NAME
    ],
    examples: [
        COMMAND_NAME
    ],
    aliases: [
        'books'
    ],
	execute(message, args) {
        const embed = setEmbed({
            title: 'Risale i Nur Boeken.',
            description: 'De boeken zijn gratis online te lezen.',
            fields: renderReadBooksFields,
            message
        });
    
        return message.channel.send(embed);
    }
};
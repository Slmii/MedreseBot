const { setEmbed } = require('../helpers/embed');
const { getBook, renderOrderBooksFields } = require('../helpers/books');

const COMMAND_NAME = 'bestellen';

module.exports = {
    active: true,
    name: COMMAND_NAME,
    description: 'Een lijst van alle URLs waar boeken besteld kunnen worden of een URL van een specifiek boek.',
    maxArgs: 1,
    usages: [
        COMMAND_NAME, 
        `${COMMAND_NAME} [boek]`
    ],
    examples: [
        COMMAND_NAME, 
        `${COMMAND_NAME} ramadan`
    ],
    aliases: [
        'order', 
        'bestel'
    ],
	execute(message, args) {
        if (args.length) {
            const bookCommand = args[0];
            const book        = getBook(bookCommand);
            if (book) {
                const { title, store } = book;
    
                const embed = setEmbed({
                    title,
                    description: store
                });
    
                return message.channel.send(embed);
            } 
            
            const embed = setEmbed({
                title: `Boek \`${bookCommand}\` niet gevonden.`,
                description: 'De onderstaande boeken zijn beschikbaar:',
                fields: renderOrderBooksFields
            });
    
            return message.channel.send(embed);
        }
        
        const embed = setEmbed({
            title: 'De boeken zijn te bestellen via https://www.lucideinkt.nl.',
            description: 'Gebruik `.bestellen [boek]` voor een specifiek boek.',
            fields: renderOrderBooksFields
        });

        return message.channel.send(embed);
	}
};
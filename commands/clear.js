const { setErrorEmbed } = require('../helpers/embed');

const COMMAND_NAME = 'clear';

module.exports = {
    admin: true,
    active: true,
    name: COMMAND_NAME,
    description: 'Berichten verwijderen in de huidige kanaal.',
    args: true,
    maxArgs: 1,
    usages: [
        `${COMMAND_NAME} <nummer (1-99)>`
    ],
    examples: [
        `${COMMAND_NAME} 10`
    ],
    aliases: [
        'purge'
    ],
    cooldown: 10,
	async execute(message, args) {
        const errorEmbed = setErrorEmbed({ usages: this.usages, examples: this.examples, prefix: true })
        
        if (isNaN(args[0])) {
            return message.channel.send(errorEmbed);
        } 
        
        const number = parseInt(args[0]) + 1;
        if (number <= 1 || number > 100) {
            return message.channel.send(errorEmbed);
        }
        
        return await message.channel.bulkDelete(number);
	}
};
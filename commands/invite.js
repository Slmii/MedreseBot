const COMMAND_NAME = 'invite';

module.exports = {
    active: true,
    name: COMMAND_NAME,
    description: 'Uitnodiging voor de server.',
    args: false,
    usages: [
        `${COMMAND_NAME}`
    ],
    examples: [
        `${COMMAND_NAME}`
    ],
    aliases: [
        'uitnodiging',
        'join'
    ],
    cooldown: 10,
	async execute(message, args) {
        return message.channel.send('https://discord.gg/THrDpw2');
	}
};
const COMMAND_NAME = 'rol';

module.exports = {
    active: true,
    name: COMMAND_NAME,
    description: 'Rol toewijzen aan een gebruiker of verwijder een rol van jezelf.',
    args: true,
    minArgs: 1,
    methods: [
        'add',
        'remove' 
    ],
    usages: [
        `${COMMAND_NAME} <methode> <...argumenten>`,
    ],
    examples: [
        `${COMMAND_NAME} add @gebruiker emmen`,
        `${COMMAND_NAME} remove emmen`
    ],
    aliases: [
        'role'
    ],
    cooldown: 5,
	async execute(message, args) {
        
	}
};
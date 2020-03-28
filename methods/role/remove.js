const { setEmbed } = require('../../helpers/embed');
const { sortByProperty } = require('../../helpers/utils');

const COMMAND_NAME = 'rol';
const METHOD_NAME  = 'verwijderen';

module.exports = {
    active: true,
    name: METHOD_NAME,
    description: 'Verwijder een rol',
    args: true,
    maxArgs: 1,
    usages: [
        `rol verwijderen <rol>`
    ],
    examples: [
        `${COMMAND_NAME} ${METHOD_NAME} emmen`
    ],
    aliases: [
        'remove',
    ],
    help: `${COMMAND_NAME} ${METHOD_NAME}`,
	async execute(message, args, command) {
        const roleName = args[0].toLowerCase().trim();

        // Get current member
        const member = message.guild.member(message.author);
        // Get current roles
        const roles = member.roles.cache;

        // Check if the user has the mentioned role or not
        const hasUserRole = roles.find(role => role.name.toLowerCase() === roleName);
        if (!hasUserRole) {
            const embed = setEmbed({
                title: `Rol \`${roleName}\` is niet toegewezen om te kunnen verwijderen.`,
                description: `<@${member.user.id}>`,
                fields: [
                    { 
                        name: `Rollen [${roles.map(role => role).length}]`,
                        value: sortByProperty(roles, 'name').map(role => role).join(' ')
                    }
                ]
            });
    
            return await message.channel.send(embed);
        }

        // Remove existing role from the current user and return an updated member object
        const updatedMember = await member.roles.remove(hasUserRole);
        // Get updated roles
        const updatedRoles = updatedMember.roles.cache;

        // Notify user
        const embed = setEmbed({
            title: `Rol \`${roleName}\` is verwijderd.`,
            description: `<@${member.user.id}>`,
            fields: [
                { 
                    name: `Rollen [${updatedRoles.map(role => role).length}]`,
                    value: sortByProperty(updatedRoles, 'name').map(role => role).join(' ')
                }
            ]
        });

        return await message.channel.send(embed);
	}
};

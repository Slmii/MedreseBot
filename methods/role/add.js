const { setEmbed, setErrorEmbed } = require('../../helpers/embed');
const { sortByProperty }          = require('../../helpers/utils');

const COMMAND_NAME = 'rol';
const METHOD_NAME  = 'toewijzen';

module.exports = {
    active: true,
    admin: true,
    name: METHOD_NAME,
    description: 'Rol toewijzen aan een tagged gebruiker.',
    args: true,
    minArgs: 2,
    maxArgs: 2,
    usages: [
        `rol toewijzen <gebruiker> <rol>`
    ],
    examples: [
        `${COMMAND_NAME} ${METHOD_NAME} @gebruiker emmen`
    ],
    aliases: [
        'add',
    ],
    help: `${COMMAND_NAME} ${METHOD_NAME}`,
	async execute(message, args, command) {
        const errorEmbed = setErrorEmbed({ usages: this.usages, examples: this.examples, prefix: true })

        // If there is no user mentioned
        if (!message.mentions.members.first()) {
            return message.channel.send(errorEmbed); 
        }

        // Get the rolename from the argument
        const roleName = args[1].toLowerCase().trim();
        // Change the rolename to first char uppercase. This is the rolename that will be added
        const roleNameToAdd = roleName.charAt(0).toUpperCase() + roleName.slice(1);

        // Get the mentioned user
        const member = message.mentions.members.first();
        // Get current roles
        const roles = member.roles.cache;
        
        // Check if the user already has the mentioned role or not
        const hasUserRole = roles.find(role => role.name.toLowerCase() === roleName);
        if (hasUserRole) {
            const embed = setEmbed({
                title: `Rol \`${roleName}\` is al toegewezen.`,
                description: `<@${member.user.id}>`,
                fields: [
                    { 
                        name: `Rollen [${roles.map(role => role).length}]`,
                        value: sortByProperty(roles, 'name').map(role => role).join(' ')
                    }
                ],
                message
            });
    
            return message.channel.send(embed);
        }

        // Check if the role exists in the guild, if not we add the role automatically
        let role = message.guild.roles.cache.find(role => role.name.toLowerCase() === roleName);
        
        if (!role) {
            // Add the role by using the bot
            role = await message.guild.roles.create({
                data: {
                    name: roleNameToAdd,
                    color: 'RANDOM',
                    hoist: true,
                    mentionable: true
                }
            });
        }
      
        // Add existing/new role to the mentioned user and return an updated member object
        const updatedMember = await member.roles.add(role);
        // Get updated roles
        const updatedRoles = updatedMember.roles.cache;

        // Notify user
        const embed = setEmbed({
            title: `Rol \`${roleName}\` is toegewezen.`,
            description: `<@${member.user.id}>`,
            fields: [
                { 
                    name: `Rollen [${updatedRoles.map(role => role).length}]`,
                    value: sortByProperty(updatedRoles, 'name').map(role => role).join(' ')
                }
            ],
            message
        });

        return message.channel.send(embed);
	}
};



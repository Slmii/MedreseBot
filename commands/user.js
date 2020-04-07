const { formatDate }              = require('../helpers/date');
const { setEmbed, setErrorEmbed } = require('../helpers/embed');

const COMMAND_NAME = 'userinfo';

module.exports = {
    active: true,
    name: COMMAND_NAME,
    description: 'Informatie weergeven over jezelf of van een gebruiker.',
    maxArgs: 1,
    usages: [
        COMMAND_NAME, 
        `${COMMAND_NAME} [gebruiker]`
    ],
    examples: [
        COMMAND_NAME, 
        `${COMMAND_NAME} @gebruiker`
    ],
    aliases: [
        'user', 
        'gebruiker'
    ],
	execute(message, args) {
        const errorEmbed = setErrorEmbed({ usages: this.usages, examples: this.examples, prefix: true })
        let user = null;

        // Get info about current user
        if (!args.length) {
            user = message.author;
        } else {
            if (!message.mentions.users.first()) {
                return message.channel.send(errorEmbed); 
            }

            // Get info about mentioned user
            user = message.mentions.users.first();
        }
        
        const member = message.guild.member(user);
        const embed = setEmbed({
            author: {
                name: member.user.tag
            },
            description: `<@${member.user.id}>`,
            thumbnail: member.user.displayAvatarURL(),
            fields: [
                { 
                    name: 'Linds sinds',
                    value: formatDate({ 
                        date: member.guild.joinedAt, 
                        dateFormat: 'dd, D MMMM, gggg' 
                    }),
                    inline: true,
                },
                {
                    name: 'Geregistreerd op',
                    value: formatDate({ 
                        date: user.createdAt, 
                        dateFormat: 'dd, D MMMM, gggg' 
                    }),
                    inline: true,
                },
                { 
                    name: `Rollen [${member.roles.cache.map(role => role).length}]`,
                    value: member.roles.cache.map(role => role).join(' ')
                },
            ],
            message
        });

        return message.channel.send(embed);        
	}
};
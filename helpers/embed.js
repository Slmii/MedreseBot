const Discord = require('discord.js');

const { renderResults } = require('./utils');

const COLOR  = [148,54,52];

const setEmbed = config => {
    const embed = new Discord.MessageEmbed();

    const { author, title, description, fields, thumbnail, message } = config;
    
    if (author) {
        embed.setAuthor(author.name, author.iconURL || '');
    }

    if (title) {
        embed.setTitle(title);
    }

    if (description) {
        embed.setDescription(description);
    }

    if (fields) {
        if (typeof fields == 'function') {
            embed.addFields(fields());
        } else {
            embed.addFields(fields);
        }
    }

    if (thumbnail) {
        embed.setThumbnail(thumbnail);
    }

    if (message) {
        embed.setFooter(
            `${message.guild.name} | Discord ID: ${message.guild.member(message.author).user.id}`, 
            message.guild.iconURL()
        );
    }

    embed
    .setTimestamp()
    .setColor(COLOR);

    return embed;
};

const setErrorEmbed = ({ title, usages, examples, prefix }) => {
    const errorEmbed = setEmbed({
        title: title ? title : 'Ongeldig gebruik van de commando.',
        fields: [
            { 
                name: 'Hoe wordt de commando gebruikt?', 
                value: renderResults({ data: usages, prefix })
            },
            {
                name: 'Uitleg',
                value: 'Verplicht: `<>` | Optioneel: `[]`'
            },
            { 
                name: 'Voorbeeld(en) van hoe de commando gebruikt wordt', 
                value: renderResults({ data: examples, prefix })
            },
            {
                name: 'Hulp nodig?',
                value: `\`.help <commando>\``
            }
        ]
    });

    return errorEmbed;
};

module.exports = {
    setEmbed,
    setErrorEmbed
};
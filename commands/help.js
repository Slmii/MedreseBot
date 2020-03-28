const { PREFIX }                        = require('../config.json');
const { findCommand }                   = require('../validations/command');
const { findMethod }                    = require('../validations/method');
const { setEmbed }                      = require('../helpers/embed');
const { sortByProperty, renderResults } = require('../helpers/utils');

const COMMAND_NAME = 'help';

module.exports = {
    active: true,
    name: COMMAND_NAME,
    description: 'Een lijst van alle opdrachten of informatie over een specifiek opdracht.',
    maxArgs: 2,
    usages: [
        COMMAND_NAME, 
        `${COMMAND_NAME} [commando]`
    ],
    examples: [
        COMMAND_NAME, 
        `${COMMAND_NAME} boeken`
    ],
    aliases: [
        'commands', 
        'commandos'
    ],
	execute(message, args) {
        const { commands, methods } = message.client;
        // Filter out non active commands
        const activeCommands = commands.filter(command => command.active);
        // Sort commands
        const commandNames = sortByProperty(activeCommands, 'name').map(({ name }) => name);
        // Get the entered command name for help
        const commandName = args[0].toLowerCase();

        if (!args.length) {
            const embed = setEmbed({
                title: 'De onderstaande commando\'s zijn beschikbaar.',
                description: renderResults({ data: commandNames, inline: true }),
                fields: [
                    { 
                        name: 'Specifieke commando', 
                        value: `Gebruik \`${PREFIX}help [commando]\` om informatie over een specifieke commando te krijgen.` 
                    }
                ]
            });

            return message.channel.send(embed);
        } else if (args.length === 2) {
            // Get the entered method name for help
            const methodName = args[1].toLowerCase();
            // Get the correct method (from the method files)
            const method = findMethod(methods, methodName);
            if (!method) {
                const embed = setEmbed({
                    title: `Methode \`${methodName}\` is niet gevonden.`,
                    fields: [
                        {
                            name: 'Hulp nodig?',
                            value: `\`${PREFIX}help ${commandName}\``
                        }
                    ]
                });

                return message.channel.send(embed);
            }

            const embed = setEmbed({
                title: method.name,
                fields: [
                    { 
                        name: 'Omschrijving', 
                        value: method.description ? method.description : 'Omschrijving onbekend' 
                    },
                    { 
                        name: 'Alias', 
                        value: method.aliases ? renderResults({ data: method.aliases }) : '-',
                        inline: true
                    },
                    {
                        name: 'Methodes',
                        value: method.methods ? renderResults({ data: method.methods }) : '-',
                        inline: true
                    },
                    { 
                        name: 'Hoe wordt de methode gebruikt?', 
                        value: renderResults({ data: method.usages, prefix: true })
                    },
                    {
                        name: 'Uitleg',
                        value: 'Verplicht: `<>` | Optioneel: `[]`'
                    },
                    { 
                        name: 'Voorbeeld(en) van hoe de methode gebruikt wordt', 
                        value: renderResults({ data: method.examples, prefix: true })
                    }
                ]
            });
    
            return message.channel.send(embed);
        }

        // Get the correct command (from the command files)
        const command = findCommand(commands, commandName);
        if (!command) {
            const embed = setEmbed({
                title: `Commando \`${commandName}\` is niet gevonden.`,
                fields: [
                    {
                        name: 'Hulp nodig?',
                        value: `\`${PREFIX}help\``
                    }
                ]
            });

            return message.channel.send(embed);
        }

        const embed = setEmbed({
            title: command.name,
            fields: [
                { 
                    name: 'Omschrijving', 
                    value: command.description ? command.description : 'Omschrijving onbekend' 
                },
                { 
                    name: 'Alias', 
                    value: command.aliases ? renderResults({ data: command.aliases }) : '-',
                    inline: true
                },
                {
                    name: 'Methodes',
                    value: command.methods ? renderResults({ data: command.methods }) : '-',
                    inline: true
                },
                { 
                    name: 'Cooldown', 
                    value: `${command.cooldown ? command.cooldown : 2} seconde(n)`,
                    inline: true
                },
                { 
                    name: 'Hoe wordt de commando gebruikt?', 
                    value: renderResults({ data: command.usages, prefix: true })
                },
                {
                    name: 'Uitleg',
                    value: 'Verplicht: `<>` | Optioneel: `[]`'
                },
                { 
                    name: 'Voorbeeld(en) van hoe de commando gebruikt wordt', 
                    value: renderResults({ data: command.examples, prefix: true })
                }
            ]
        });

        return message.channel.send(embed);
	}
};
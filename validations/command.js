const { PREFIX }        = require('../config.json');
const { setErrorEmbed } = require('../helpers/embed');

const findCommand = (commands, commandToFind) => {
    const command = commands.get(commandToFind) || commands.find(({ aliases }) => aliases && aliases.includes(commandToFind));
    return command;
};

const commandValidations = (command, args) => {
    // Check if command has 'args' property
    const hasArgsProperty = command.hasOwnProperty('args');

    // Title of the embed
    let title = '';

    // Command validatons
    if (hasArgsProperty && (command.args && !args.length)) {
        title = `\`${PREFIX}${command.name}\` vereist ${command.methods ? 'een methode' : `minstens ${command.minArgs ? command.minArgs : 1} argument(en)`}`;
    } else if (hasArgsProperty && (!command.args && args.length)) {
        title = `\`${PREFIX}${command.name}\` mag geen argument(en) bevatten`;
    } else if ((hasArgsProperty || !hasArgsProperty) && (args.length && args.length < command.minArgs)) {
        title = `\`${PREFIX}${command.name}\` veriest minstens ${command.minArgs} argument(en)`;
    } else if ((hasArgsProperty || !hasArgsProperty) && (args.length && args.length > command.maxArgs)) {
        title = `\`${PREFIX}${command.name}\` mag maximaal ${command.maxArgs} argument(en) bevatten`;
    }

    if (title) {
        return setErrorEmbed({ title, usages: command.usages, examples: command.examples, prefix: true });
    }

    return false;
};

module.exports = {
    findCommand,
    commandValidations
};
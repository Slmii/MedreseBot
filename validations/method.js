const { setErrorEmbed } = require('../helpers/embed');

const findMethod = (methods, methodToFind) => {
    const method = methods.get(methodToFind) || methods.find(({ aliases }) => aliases && aliases.includes(methodToFind));
    return method;
};

const methodValidations = (method, args) => {
    // Check if method has 'args' property
    const hasArgsProperty = method.hasOwnProperty('args');

    // Title of the embed
    let title = '';

    // Method validatons
    if (method.args && !args.length) {
        title = `\`${method.name}\` vereist minstens ${method.minArgs ? method.minArgs : 1} argument(en)`;
    } else if (!method.args && args.length) {
        title = `\`${method.name}\` mag geen argument(en) bevatten`;
    } else if ((hasArgsProperty || !hasArgsProperty) && (args.length && args.length < method.minArgs)) {
        title = `\`${method.name}\` veriest minstens ${method.minArgs} argument(en)`;
    } else if ((hasArgsProperty || !hasArgsProperty) && (args.length && args.length > method.maxArgs)) {
        title = `\`${method.name}\` mag maximaal ${method.maxArgs} argument(en) bevatten`;
    }

    if (title) {
        return setErrorEmbed({ title, usages: method.usages, examples: method.examples, prefix: true });
    }

    return false;
};

module.exports = {
    findMethod,
    methodValidations
};
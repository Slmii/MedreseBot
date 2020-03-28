const fs                = require('fs');
const Discord           = require('discord.js');

const { findCommand, commandValidations } = require('./validations/command');
const { findMethod, methodValidations }   = require('./validations/method');
const { PREFIX }          = require('./config.json');
const { token }           = require('./config/config');
const { setEmbed }        = require('./helpers/embed');
const { cronPrayerTimes } = require('./crons/prayer.times');

const client    = new Discord.Client();
client.commands = new Discord.Collection();
client.methods  = new Discord.Collection();
const cooldowns = new Discord.Collection();

// Get all command files from directory and filter out the files that dont end with .js
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
    // Load the command file
    const command = require(`./commands/${file}`);
    // Set a command
	client.commands.set(command.name, command);
}

// Get all methods files inside the methods directory
const methodDirectories = fs.readdirSync(`${__dirname}/methods`, { withFileTypes: true })
                          .filter(directory => directory.isDirectory())
                          .map(directory => directory.name);

methodDirectories.forEach(directory => {
    // Load the method files
    const methodFiles = fs.readdirSync(`${__dirname}/methods/${directory}`).filter(file => file.endsWith('.js'));
    for (const file of methodFiles) {
        const method = require(`${__dirname}/methods/${directory}/${file}`);
        // Set a method
        client.methods.set(method.name, method);
    }
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    cronPrayerTimes(client, 'emmen').start();
});

// client.on('guildMemberAdd', async member => {
//     const adminRole = member.guild.roles.cache.find(role => role.name.toLowerCase() === 'admin');
//     const greeting = `SalamunAlaikum, <@${member.user.id}>. Laat ons weten in welke land & stad je woont zodat wij jou rollen kunnen toewijzen (<@&${adminRole.id}>).`;
//     await member.guild.channels.cache.find(({ name }) => name === 'general').send(greeting);
// });

client.on('message', async message => {
    // If the message doesnt start with the PREFIX then its not a command
    if (!message.content.startsWith(PREFIX)) {
        return false;
    }

    // Get the arguments and the commandname from the message
    const args        = message.content.slice(PREFIX.length).split(' ');
    const commandName = args.shift().toLowerCase();

    // Get the correct command (from the command files)
    const command = findCommand(client.commands, commandName);
    if (!command) {
        const embed = setEmbed({
            title: `Commando \`${commandName}\` is niet gevonden`,
            fields: [
                {
                    name: 'Hulp nodig?',
                    value: `\`${PREFIX}help\``
                }
            ]
        });

        return message.channel.send(embed);
    }

    // Check if current user is an admin
    const isAdmin = message.member.hasPermission('ADMINISTRATOR');

    // Check if the command requires admin permissions
    if (command.admin && !isAdmin) {
        return message.reply('Oh no, what is you doin?! Je bent geen admin.');
    }

    // Check if the command is active/inactive. Does not apply for admins
    if (!command.active && !isAdmin) {
        return message.reply(`\`${PREFIX}${command.name}\` commando is momenteel inactief.`);
    }

    const validationEmbed = commandValidations(command, args);
    if (validationEmbed) {
        return message.channel.send(validationEmbed);
    }

    // Add the command to the cooldowns collection if it doesnt exists
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    // Current timestamp
    const now = Date.now();
    // Get the command from the cooldowns collection
    const timestampAuthors = cooldowns.get(command.name);
    // Get the cooldown in the command and convert to milliseconds. If no cooldown is provided, the default is 2 seconds 
    const cooldownAmount = (command.cooldown || 2) * 1000;
    
    // Check if the cooldowns collection has the author ID. If yes, it means that the author already called the command before and will have the cooldown applied
    if (timestampAuthors.has(message.author.id)) {
        const expirationTime = timestampAuthors.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;

            const embed = setEmbed({
                description: `<@${message.author.id}>, wacht nog ${timeLeft.toFixed(0)} seconde(n) voordat je de commando \`${PREFIX}${command.name}\` kan herbruiken.`
            });
    
            return message.channel.send(embed);
        }
    }

    // Remove the author from the collection after the cooldown amount so that the author can use the command again
    timestampAuthors.set(message.author.id, now);
    setTimeout(() => timestampAuthors.delete(message.author.id), cooldownAmount);

    if (command.methods) {
        // Get the arguments and the methodname from the message
        const methodArgs = message.content.slice(PREFIX.length + command.name.length + 1).split(' ').slice(1);
        const methodName = args.shift().toLowerCase();

        // Get the correct method (from the method files)
        const method = findMethod(client.methods, methodName);
        if (!method) {
            const embed = setEmbed({
                title: `Methode \`${methodName}\` is niet gevonden`,
                fields: [
                    {
                        name: 'Hulp nodig?',
                        value: `\`${PREFIX}help ${command.name}\``
                    }
                ]
            });
    
            return message.channel.send(embed);
        }

        // Check if the method requires admin permissions
        if (method.admin && !isAdmin) {
            return message.reply('Oh no, what is you doin?! Je bent geen admin.');
        }

        // Check if the method is active/inactive. Does not apply for admins
        if (!method.active && !isAdmin) {
            return message.reply(`\`${method.name}\` methode is momenteel inactief.`);
        }

        const validationEmbed = methodValidations(method, args);
        if (validationEmbed) {
            return message.channel.send(validationEmbed);
        }
        
        try {
            method.execute(message, methodArgs, command);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that method!');
        }

        return;
    }

    try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});

client.login(token);

const { REST } = require('@discordjs/rest');
const { Routes } = require("discord.js");
const fs = require('fs');

module.exports = (client) => {
    client.handleCommands = async() => {
        const commandFolders = fs.readdirSync('./src/commands')
        for (const folder of commandFolders){
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter(file => file.endsWith('.js'));

            const { commands, commandArray } = client;
            for (const file of commandFiles){
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                //console.log(`Command: ${command.data.name} has been passed through the handler`)
            }
        }

        const clientID = '1083092677001748672'; // botID aka ApplicationID
        
        const rest = new REST({ version: '10' }).setToken(process.env.token);

        rest.put(Routes.applicationCommands(clientID), { body: client.commandArray })
            .then(() => console.log('Successfully registered application commands.'))
            .catch(console.error);
    };
};
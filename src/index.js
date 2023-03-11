// FOLLOWED https://youtu.be/6IgOXmQMT68
// DID NOT DOWNLOAD CHALK & DISCORD-API-TYPES

require('dotenv').config();
const { token, databaseToken } = process.env;
const { connect } = require('mongoose');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

/*
Add to the list below when needing more permissions
Discord Documentation for Intents:
https://discord.com/developers/docs/topics/gateway#list-of-intents
*/
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] });


client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`)
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter(file => file.endsWith('.js'));
    for (const file of functionFiles) 
        require(`./functions/${folder}/${file}`)(client);
}



client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(token);

(async() => { // MongoDB login
    await connect(databaseToken).catch(console.error);
})();

//1039378120790265996
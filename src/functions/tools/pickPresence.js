const { ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../../schemas/profiles');

module.exports = (client) => {
    client.pickPresence = async () => {
        
        const options = [
            {
                type: ActivityType.Watching,
                text: `over ${-1} users.`,
                status: "online"
            },
        ];

        const option = Math.floor(Math.random() * options.length);
        client.user.setPresence({
            activities: [{
                name: options[option].text,
                type: options[option].type
            }],
            status: options[option].status
        });
    };
}
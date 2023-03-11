const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        let guildProfile = await Guild.findOne({ guildId: guild.id });
        if (!guildProfile){
            guildProfile = await new Guild({ // Most likely the case b/c joining new server
                _id: mongoose.Types.ObjectId(),
                guildId: guild.id,
                guildName: guild.name,
                guildIcon: guild.iconURL() ? guild.iconURL() : "None"
            })

            await guildProfile.save().catch(console.error);
            console.log(guildProfile);
        } else {
            console.log('Profile already exists!')
        }
    },
};
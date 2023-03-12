const { ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../../schemas/profiles');
const UserModel = mongoose.model('Profile', User.schema);

module.exports = (client) => {
    client.pickPresence = async () => {
        var u_count = -1;
        UserModel.estimatedDocumentCount(function (err, count) {
            if (err){
                console.log(err)
            }else{
                u_count = count;

                const options = [
                    {
                    type: ActivityType.Watching,
                    text: `over ${u_count} users.`,
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

            }
        });        
    };
}
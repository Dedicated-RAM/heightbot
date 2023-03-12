const { EmbedBuilder } = require('discord.js');
const User = require('../../schemas/profiles');
const mongoose = require('mongoose');

module.exports = {
    data: {
        name: `deleteprofile_button`
    },
    async execute(interaction, client){

        const user = interaction.member.user
        User.findOneAndDelete({id: user.id }, function (err, docs) {
            if (err){
                console.log(error);
                interaction.reply({
                    content: "Error: Try again later.",
                    ephemeral: true
                })
            }
            else{
                console.log("Deleted User : ", docs);
                const deleteEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle("Your profile has been deleted.")
                    .setDescription("Who are you?");

                interaction.reply({
                    embeds: [deleteEmbed],
                    ephemeral: true
                })
            }
        });
    }
}
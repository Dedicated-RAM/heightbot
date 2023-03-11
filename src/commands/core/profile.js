const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../schemas/profiles');
const mongoose = require('mongoose');
const convert = require('convert-units');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Check your or another user\'s profile')
        .addUserOption(
            option => option
            .setName("user")
            .setDescription("Person whose profile you want to check")),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        
        const user = interaction.options.getUser("user") || interaction.member.user
        const userData = await User.findOne({ id: user.id })

        if(!userData){
            const heightEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`${user.username} has no profile.`)
            .setDescription("User must do \`/setheight\` to create a profile!")
            .setThumbnail(user.displayAvatarURL());

            await interaction.editReply({
                embeds: [heightEmbed]
            });

        } else {

            const centi = userData.height;
            //const inch = (Math.round((centi * 0.3937) * 4) / 4).toFixed(2) % 12;   // rounds to nearest .25
            const inch = (Math.round(convert(centi).from("cm").to("in") * 4) / 4).toFixed(2) % 12;
            const feet = Math.floor(convert(centi).from("cm").to("ft"));   // rounds to nearest .25

            const heightEmbed = new EmbedBuilder()
            .setColor(userData.profileColor)
            .setTitle(`${user.username}'s profile`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: "Metric", value: `** ${centi} cm** `, inline: true },
                { name: "Imperial", value: `** ${feet}\' ${inch}\" **`, inline: true },
            );

            await interaction.editReply({
                embeds: [heightEmbed]
            });
        }

    }
}
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../schemas/profiles');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcolor')
        .setDescription('Set your color!')
        .addStringOption(option =>
            option
            .setName("color")
            .setDescription("enter hex code: (ex. FFFF00) or type RANDOM")
            .setMinLength(6)
            .setMaxLength(6)
            .setRequired(true)
            ),
    async execute(interaction, client) {

        const message = await interaction.deferReply({
            fetchReply: true,
            ephemeral: true
        });

        // get user who envoked command & access data
        const user = interaction.member.user;
        const userData = await User.findOne({ id: user.id });

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
            
        userData.profileIcon = user.avatarURL;   // stores avatar url

        var RegExp = /^[0-9A-F]{6}$/i;
        if(RegExp.test(interaction.options.get("color").value)){
            userData.profileColor = interaction.options.get("color").value;
        } else {
            userData.profileColor = "Random";
        }

        await userData.save().catch(console.error);

        const colorEmbed = new EmbedBuilder()
            .setTitle(`${user.username}'s color updated!`)
            .setColor(userData.profileColor)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: "Color", value: `${userData.profileColor}`, inline: true },
                )

        await interaction.editReply({
            embeds: [colorEmbed]
        });

        }
    }
}
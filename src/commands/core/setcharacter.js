const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../schemas/profiles');
const mongoose = require('mongoose');
const  convert = require('convert-units');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcharacter')
        .setDescription('Set your compare character!')
        .addStringOption(options =>
            options
            .setName("character")
            .setDescription("This only affects what your character looks like")
            .setRequired(true)
            .addChoices(
				{ name: 'Man', value: 'male' },
				{ name: 'Woman', value: 'female' },
            )
        ),
    async execute(interaction, client) {

        const message = await interaction.deferReply({
            fetchReply: true,
            ephemeral: true
        });

        // selection is either male or female
        const selection = interaction.options.getString('character');

        // get user who envoked command & access data
        const user = interaction.member.user
        const userData = await User.findOne({ id: user.id })

        if(!userData){
            const charEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`${user.username} has no profile.`)
            .setDescription("User must do \`/setheight\` to create a profile!")
            .setThumbnail(user.displayAvatarURL());

            await interaction.editReply({
                embeds: [charEmbed]
            });

        } else {
            
        userData.preferredCharacter = selection;    // heights stored in centimeters
        userData.profileIcon = user.avatarURL;   // stores avatar url
        await userData.save().catch(console.error);

        const charEmbed = new EmbedBuilder()
            .setColor(userData.profileColor)
            .setTitle(`${user.username}'s character updated!`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: "Character", value: `**${selection}** `, inline: true },
                )
        
        await interaction.editReply({
            embeds: [charEmbed]
        });

        }
    }
}
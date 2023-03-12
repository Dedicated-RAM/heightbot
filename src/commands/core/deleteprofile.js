const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteprofile')
        .setDescription('Erases your profile from the bots memory'),
    async execute(interaction, client) {
        const button = new ButtonBuilder()
            .setCustomId('deleteprofile_button')
            .setStyle(ButtonStyle.Danger)
            .setLabel(`Delete profile`);

        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(button)],
            content: "Are you sure?",
            ephemeral: true,
            fetchReply: true
        });
        await wait(6000)
        await interaction.deleteReply();

    }
}
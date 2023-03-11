const { InteractionType } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: `Oops! Something went wrong while executing this command!`,
                    ephemeral: true // only command user can see the message
                });
            }
        } else if (interaction.isButton()) {
            // Buttons
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);
            if (!button) return new Error('There is no code for this button.'); // checks to make sure the button exists

            try {
                await button.execute(interaction, client); // tries to execute the button function located in the buttons folder
            } catch (err) {
                console.error(err);
            }
        } else if (interaction.isSelectMenu()) {
            // Select Menu
            const { selectMenus } = client;
            const { customId } = interaction;
            const menu = selectMenus.get(customId); // customId for menus and buttons CAN overlap in names (ex. ban button, ban submenu)
            if (!menu) return new Error("There is no code for this select menu.");

            try {
                await menu.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.type == InteractionType.ModalSubmit) { // TODO: might need to change all other IF statements to this type due to possible interaction.isX depreciation
            // Survey Form built into discord
            const { modals } = client;
            const { customId } = interaction;
            const modal = modals.get(customId);
            if (!modal) return new Error("There is no code for this modal.");
            try {
                await modal.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isContextMenuCommand()) {
            // Context Menus are APP commands when you right click a user
            const { commands } = client;
            const { commandName } = interaction;
            const contextCommand = commands.get(commandName);
            if (!contextCommand) return; // TODO: Maybe return console error

            try {
                await contextCommand.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            // Command with autocomplete => https://youtu.be/vLFdRtQ7tS4
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return; // TODO: Maybe return console error

            try {
                await command.autocomplete(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }
    },
};
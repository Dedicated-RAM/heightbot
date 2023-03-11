const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../schemas/profiles');
const mongoose = require('mongoose');
const convert = require('convert-units');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setheight')
        .setDescription('Set your height!')
        .addSubcommand(subcommand =>
            subcommand
                .setName("metric")
                .setDescription("Height in centimeters")
                .addNumberOption(option =>
                    option
                        .setName("centimeters")
                        .setDescription("enter centimeters")
                        .setMinValue(0)
                        .setMaxValue(30480)
                        .setRequired(true)
                    )
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName("imperial")
                .setDescription("Height in feet and inches")
                .addIntegerOption(option =>
                    option
                        .setName("feet")
                        .setDescription("enter feet")
                        .setMinValue(0)
                        .setMaxValue(1000)
                        .setRequired(true)
                    )
                .addNumberOption(option =>
                    option
                        .setName("inches")
                        .setDescription("enter inches")
                        .setMinValue(0)
                        .setMaxValue(11.75)
                    )
            ),
    async execute(interaction, client) {

        const message = await interaction.deferReply({
            fetchReply: true,
            ephemeral: true
        });

        // get user who envoked command & access data
        const user = interaction.member.user
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })

        var centi = 0;
        var inch = 0;
        var feet = 0;

        if( interaction.options.getSubcommand() === "metric" ){
            centi = interaction.options.get("centimeters").value

            // format the numbers:
            // centimeters  --> nearest .01th
            // inches       --> nearest 0.25
            // feet         --> whole number
            centi = Number(centi.toFixed(2));
            inch = Number(convert(centi).from("cm").to("in").toFixed(2));
            feet = Math.floor(inch / 12);
            inch = (inch % 12).toFixed(2);

        } else if ( interaction.options.getSubcommand() === "imperial" ){

            feet = interaction.options.get("feet").value;
            inch = interaction.options.get("inches").value ?? 0;
            const temp = inch + feet * 12;
            // format the numbers:
            inch = Number((Math.round(inch * 4) / 4).toFixed(2));   // rounds to nearest .25
            centi = Number(convert(temp).from("in").to("cm").toFixed(2)); // convert formatted inches to centi
        }

        userData.height = centi;    // heights stored in centimeters
        userData.profileIcon = user.avatarURL;   // stores avatar url
        await userData.save().catch(console.error);

        
        // const heightEmbed = new EmbedBuilder()
        //     .setColor("#"+userData.profileColor)
        //     .setTitle(`${user.username}'s height updated!`)
        //     .setThumbnail(user.displayAvatarURL())
        //     .addFields(
        //         { name: "Metric", value: `** ${centi} cm** `, inline: true },
        //         { name: "Imperial", value: `** ${feet}\' ${inch}\" **`, inline: true },
        //         )

        const heightEmbed = new EmbedBuilder()
            .setColor(userData.profileColor)
            .setTitle(`${user.username}'s height updated!`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: "Metric", value: `** ${centi} cm** `, inline: true },
                { name: "Imperial", value: `** ${feet}\' ${inch}\" **`, inline: true },
                )
        
        await interaction.editReply({
            embeds: [heightEmbed]
        });
    }
}
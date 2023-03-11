const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../schemas/profiles');
const mongoose = require('mongoose');
const convert = require('convert-units');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('compare')
        .setDescription('Compare user heights!')
        .addUserOption(
            option => option
            .setName("user1")
            .setDescription("1st user")
            .setRequired(true)
            )
        .addUserOption(
            option => option
            .setName("user2")
            .setDescription("2nd user")
            .setRequired(true)
            )
        .addUserOption(
            option => option
            .setName("user3")
            .setDescription("3rd user"))
        .addUserOption(
            option => option
            .setName("user4")
            .setDescription("4th user"))
        .addUserOption(
            option => option
            .setName("user5")
            .setDescription("5th user"))
        .addUserOption(
            option => option
            .setName("user6")
            .setDescription("6th user")),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const users = "123456";
        var kv = {}

        for (var i = 0; i < users.length; i++) {
            var user = interaction.options.getUser("user" + users.charAt(i));
            if (!user) { continue; }
            var userdata = await User.findOne({ id: user.id });
            if(!userdata) {
                const heightEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle(`${user.username} has no profile.`)
                    .setDescription("User must do \`/setheight\` to create a profile!")
                    .setThumbnail(user.displayAvatarURL());
    
                    await interaction.editReply({
                        embeds: [heightEmbed]
                    });
                    return -1;
            }
            kv[user.username] = await User.findOne({ id: user.id });
        }

        console.log(kv);
        // const user = interaction.options.getUser("user3")
        // console.log(user);
        var localData_array = []
        var id_count = 1;
        const colors = ["FF0000", "FFFF00", "FF00FF", "00FF00", "00FFFF", "00FFEE", "EEFF00", "FFEE00", "EE00FF"]
        var color = "000000"

        for (var key in kv){
            //console.log( key, kv[key] );
            if(kv[key].profileColor === "Random") { color = colors[Math.floor(Math.random()*colors.length)] }
            else { color = kv[key].profileColor }
            localData_array.push(
                {
                    "name": key,                    // username
                    "cm": kv[key].height,                    // centimeters rounded to  nearest whole number
                    "ft": Math.floor(convert(kv[key].height).from("cm").to("ft")),                        // feet
                    "inch": (convert(kv[key].height).from("cm").to("in") % 12).toFixed(2),                  // inches, can be float
                    "background_color": "#" + color,  // specified hex
                    "gender": kv[key].preferredCharacter,               // specified gender
                    "id": id_count                         // ID order needed
                }
            )
            id_count += 1;
        }

        console.log(JSON.stringify(localData_array));


        await interaction.editReply({
            content: "hi"
        });

        //const userData = await User.findOne({ id: user.id })
        //user.username

        // if(!userData){
        //     const heightEmbed = new EmbedBuilder()
        //     .setColor(0xFF0000)
        //     .setTitle(`${user.username} has no profile.`)
        //     .setDescription("User must do \`/setheight\` to create a profile!")
        //     .setThumbnail(user.displayAvatarURL());

        //     await interaction.editReply({
        //         embeds: [heightEmbed]
        //     });

        // } else {

        //     const centi = userData.height;
        //     //const inch = (Math.round((centi * 0.3937) * 4) / 4).toFixed(2) % 12;   // rounds to nearest .25
        //     const inch = (Math.round(convert(centi).from("cm").to("in") * 4) / 4).toFixed(2) % 12;
        //     const feet = Math.floor(convert(centi).from("cm").to("ft"));   // rounds to nearest .25

        //     const heightEmbed = new EmbedBuilder()
        //     .setColor(userData.profileColor)
        //     .setTitle(`${user.username}'s profile`)
        //     .setThumbnail(user.displayAvatarURL())
        //     .addFields(
        //         { name: "Metric", value: `** ${centi} cm** `, inline: true },
        //         { name: "Imperial", value: `** ${feet}\' ${inch}\" **`, inline: true },
        //     );

        //     await interaction.editReply({
        //         embeds: [heightEmbed]
        //     });
        // }

    }
}
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
module.exports = {
    run: async (bot, interaction) => {
        // Edit interacted message
        var embed = new MessageEmbed(interaction.message.embeds[0])
        var components = []
        interaction.message.components.forEach((row) => {
            row.components.forEach((comp) => {
                components.push((new MessageButton(comp)).setDisabled(true))
            })
        })
        interaction.message.edit({ embeds: [embed], components: [new MessageActionRow().setComponents(components)] })

        // Response
        interaction.user.send({ embeds: [new MessageEmbed().setColor('BLUE')
            .setTitle('What is your reasoning?')
            .setDescription('This will be posted for the associated server to see and you may be eligible for being timed out for misuse.')
            .setFooter({ text: 'Type "cancel" to end prompt.' })] })
        bot.client.Data.setUserData(bot.client, bot.client.Data.Memory.Active[interaction.user.id].Guild, interaction.user.id, "Responding", true)
        bot.client.Data.setUserData(bot.client, bot.client.Data.Memory.Active[interaction.user.id].Guild, interaction.user.id, "ResponseType", "reasonCredit")
    }
}
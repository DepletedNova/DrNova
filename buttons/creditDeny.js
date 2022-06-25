const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { searchCreditReply } = require('../util/functions')
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

        // Respond
        searchCreditReply(bot.client, interaction.user)
    }
}
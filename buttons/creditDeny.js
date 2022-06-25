const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { searchCreditReply } = require('../util/functions')
module.exports = {
    run: async (bot, interaction) => {
        // Edit interacted message
        var embed = new MessageEmbed(interaction.message.embeds[0])
        interaction.message.edit({ embeds: [embed], components: [] })

        // Respond
        searchCreditReply(bot.client, interaction.user)
    }
}
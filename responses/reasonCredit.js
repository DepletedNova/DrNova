const { cancelPrompt } = require("../util/functions")
const { MessageEmbed } = require('discord.js')

module.exports = {
    privateOnly: true,
    run: async (bot, message) => {
        const {client} = bot

        var data = client.Data.Memory.Active[message.author.id]

        // Check if cancel
        if (message.content.toLowerCase().includes('cancel'))
            return cancelPrompt(client, message)
        
        // Finalize
        let reason = `"${message.content.substring(0, 1020)}"`
        client.Data.defaultUser(bot, data.Target, data.Guild)
        client.Data.setUserData(client, data.Guild, data.Target, "Credit", client.Data.getUserData(client, data.Guild, data.Target).Credit + data.Amount)
        client.Data.save(client)

        // Log
        if (client.Data.getGuildData(client, data.Guild).LogChannel != 0)
        {
            var guild = await client.guilds.fetch(data.Guild)
            var target = await guild.members.fetch(data.Target)
            var member = await guild.members.fetch(message.author.id)
            var channel = await client.channels.fetch(client.Data.getGuildData(client, data.Guild).LogChannel)
            var total = client.Data.getUserData(client, data.Guild, data.Target).Credit
            channel.send({ embeds: [new MessageEmbed().setColor(data.Amount > 0 ? 'GREEN' : 'RED')
                .setTitle(`\`${data.Amount > 0 ? '+' : '-'}${Math.abs(data.Amount)}\` to ${target.nickname ? target.nickname : target.user.tag}`)
                .setDescription(`${target.nickname ? target.nickname : target.user.tag} now has \`${
                    total > 0 ? '+' : total < 0 ? '-' : ''}${Math.abs(total)}\` credits`)
                .setAuthor({ name: member.user.tag, iconURL: member.avatarURL() ? member.avatarURL() : member.user.avatarURL() })
                .setThumbnail(target.avatarURL() ? target.avatarURL() : target.user.avatarURL())
            .addField("Reasoning", reason)
            .setTimestamp() ] })
        }

        // Cleanup
        delete client.Data.Memory.Active[message.author.id]
    }
}
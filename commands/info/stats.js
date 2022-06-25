const { MessageEmbed } = require('discord.js')
const { memberFromArgs } = require('../../util/functions')
module.exports = {
    name: "stats",
    category: "info",
    description: "Gives back information about any given member",
    usage: `dr.stats \`[OPTIONAL] user\``,
    permissions: [],
    devOnly: false,
    run: async ({bot, message, args}) => {
        const {client} = bot

        var targetedMember = message.member

        // Check parameters
        if (args[0])
        {
            var target = await memberFromArgs(message, args[0])
            if (target) targetedMember = target
        }

        // Format stats
        var embed = new MessageEmbed()
            .setThumbnail(targetedMember.avatarURL() ? targetedMember.avatarURL() : targetedMember.user.avatarURL())
            .setTitle(targetedMember.nickname ? `${targetedMember.nickname} (${targetedMember.user.tag})` : targetedMember.user.tag)
            .setDescription(`Member of \`${message.guild.name}\` since \`${targetedMember.joinedAt.toUTCString()}\``)

        await client.Data.defaultUser(bot, targetedMember.user.id, message.channel.guild.id)
        var data = client.Data.getUserData(client, message.channel.guild.id, targetedMember.user.id)
        embed.addField("Credits", `\`${data.Credit > 0 ? '+' : data.Credit < 0 ? '-' : ''}${Math.abs(data.Credit)}\``)
        
        
        // Send stats
        message.reply({ embeds: [embed] })
    }
}
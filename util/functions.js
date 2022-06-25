const fs = require("fs")
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js') 

//! Files
const getFiles = (path, ending) => {
    return fs.readdirSync(path).filter(f=>f.endsWith(ending))
}

//! Collection
const getRecentMessage = async (channel, userID) => {
    var msgs = await channel.messages.fetch({ limit: 5 })
    msgs.forEach(message => {
        if (message.author.id == userID)
            {
                return message
            }
    })
}

//! Bot responses
// Credit responses
const confirmCreditReply = (client, msg) => {
    // Response
    var data = client.Data.Memory.Active[msg.author.id]
    client.guilds.fetch(data.Guild).then((x) => x.members.fetch(data.Target).then((target) => {
        msg.author.send({ embeds: [new MessageEmbed().setColor('BLUE')
            .setTitle(`Do you wish to apply \`${data.Amount > 0 ? '+' : '-'}${Math.abs(data.Amount)}\` to \`${
                target.nickname ? `${target.nickname} (${target.user.tag})` : target.user.tag}\``)
            .setThumbnail(target.avatarURL() ? target.avatarURL() : target.user.avatarURL())
            .setDescription('Denying will prompt you to type in someones username')],
            components: [new MessageActionRow()
                .addComponents([new MessageButton()
                    .setStyle('SUCCESS')
                    .setCustomId('creditAccept')
                    .setLabel('✔'),
                    new MessageButton()
                    .setStyle('DANGER')
                    .setCustomId('creditDeny')
                    .setLabel('✖')])] })
                .then((m) => setTimeout(() => {if (m) m.delete()}, 7500))
    }))

    // Collector
    var collector = msg.channel.createMessageComponentCollector({ time: 7500 })
    collector.on('collect', async i => {
        await i.deferUpdate()
    })
    collector.on('end', async i => {
        delete collector
    })
    
    client.Data.Memory.Collection[msg.channel.id] = collector
}
const searchCreditReply = (client, user) => {
    var data = client.Data.Memory.Active[user.id]
    user.send({ embeds: [new MessageEmbed().setColor('BLUE')
        .setTitle(`Who do you wish to apply \`${data.Amount > 0 ? '+' : '-'}${Math.abs(data.Amount)}\` to?`)
        .setDescription("Type in their username or nickname (or a small portion of either) and I will try to find who you are looking for.")
        .setFooter({ text: 'Type "cancel" to end prompt.' }) ] })
    client.Data.setUserData(client, data.Guild, user.id, "Responding", true)
    client.Data.setUserData(client, data.Guild, user.id, "ResponseType", "searchCredit")
}
// Generic responses
const cancelPrompt = (client, msg) => {
    client.Data.setUserData(client.Data.Memory.Active[msg.author.id].Guild, msg.author.id, "Responding", false)
    delete client.Data.Memory.Active[msg.author.id]
    getRecentMessage(msg.channel, client.user.id).then(x => x.delete())
    msg.reply("Prompt cancelled.")
}

//! Export
module.exports = {
    getFiles,
    getRecentMessage,
    confirmCreditReply,
    searchCreditReply,
    cancelPrompt,
}
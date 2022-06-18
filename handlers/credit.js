const { MessageEmbed, MessageActionRow } = require('discord.js') 

module.exports = async (bot, msg, amount) => {
    const {client} = bot

    // Get contextual target
    var target
    if (msg.reference) await msg.channel.messages.fetch(msg.reference.messageId).then((tmsg) => 
        target = (tmsg != null && !tmsg.author.bot && tmsg.author.id != msg.author.id) ? tmsg : null)
    if (!target) {
        await msg.channel.messages.fetch({ limit: 10 }).then((msgs) => {
            msgs.forEach(nmsg => {
                if (!target && !nmsg.author.bot && nmsg.author.id != msg.author.id)
                    target = nmsg
            })
        })
    }

    // Reply to sender
    msg.author.send({ content: target ? null : "A default target was not found", embeds: [
        new MessageEmbed().setColor('BLUE')
    ] })

    // Data setup
    client.Data.Datastore.Active[msg.author.id] = {
        Amount: amount,
        Target: target.author.id,
        Guild: msg.channel.guild.id,
    }
}
const { confirmCreditReply,searchCreditReply,getRecentMessage } = require('../util/functions')

module.exports = async (bot, msg, amount) => {
    const {client} = bot
    
    // Get contextual target
    var target
    if (msg.reference) await msg.channel.messages.fetch(msg.reference.messageId).then((tmsg) => 
        target = ((tmsg != null && !tmsg.author.bot && tmsg.author.id != msg.author.id) ? tmsg.author.id : null))
    if (!target) {
        await msg.channel.messages.fetch({ limit: 10 }).then((msgs) => {
            msgs.forEach(nmsg => {
                if (!target && !nmsg.author.bot && nmsg.author.id != msg.author.id)
                    target = nmsg.author.id
            })
        })
    }

    // Data setup
    client.Data.Memory.Active[msg.author.id] = {
        Amount: amount,
        Target: target == null ? null : target,
        Guild: msg.channel.guild.id,
    }

    // Reply to sender
    if (target != null) confirmCreditReply(client, msg)
    else searchCreditReply(client, msg.author)
}
const { memberFromArgs } = require('../../util/functions')
module.exports = {
    name: "setcredit",
    category: "developer",
    description: "Sets the credit of a user",
    usage: `dr.setcredit [user] [<+ | -> amount]`,
    permissions: [],
    devOnly: true,
    run: async ({bot, message, args}) => {
        const {client} = bot
        if (!args[0] || !args[1]) return message.reply("Missing arguments.").then((msg) => setTimeout(() => msg.delete(), 5000))

        var member = await memberFromArgs(message, args[0])
        if (!member)
            return message.reply(`User \`${args[0]}\` not found`).then((msg) => setTimeout(() => msg.delete(), 5000))
        
        var amount = args[1].startsWith('+') ? Number(args[1].substring(1)) : -Number(args[1].substring(1))
        if (isNaN(amount) || (!args[1].startsWith('+') && !args[1].startsWith('-'))) 
            return message.reply(`\`${args[1]}\` is not a valid amount.`).then((msg) => setTimeout(() => msg.delete(), 5000))

        client.Data.defaultUser(bot, member.user.id, message.channel.guild.id)
        client.Data.setUserData(client, message.channel.guild.id, member.user.id, "Credit", amount)
        message.reply(`Set \`${member.nickname ? member.nickname : member.user.tag}\`s credits to \`${amount}\``)
    }
}
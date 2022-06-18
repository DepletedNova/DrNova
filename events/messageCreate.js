const Discord = require("discord.js")

module.exports = {
    name: "messageCreate",
    run: async function runAll(bot, message) {
        const {client, prefix, developers} = bot

        // Base locks
        if (message.author.bot) return

        // TODO: check for non-command response
        
        if (!message.channel.guild) return

        // member variables
        let member = message.member
        let memberID = member.id
        let guildID = message.channel.guild.id

        // Data
        if (!client.Data.getData(guildID, memberID))
            client.Data.Datastore.Guilds[guildID].Users[memberID] = {}
        client.Data.defaultUser(bot, memberID, guildID)
        client.Data.setData(guildID, memberID, "Permission", message.guild.ownerID !== message.author.id ? 3 : 
            message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) ? 2 : client.Data.getData(guildID, memberID).Permission)

        // Credit
        if (message.content.startsWith('+') || message.content.startsWith('-'))
        {
            var amount = Number(message.content.slice(1).split(/ +/g)[0].trim())
            if (amount) await client.handleCredit(bot, message, message.content.startsWith('+') ? amount : -amount)
        }

        // Command prefix
        if (!message.content.startsWith(prefix)) return
        setTimeout(() => message.delete(), 2000)

        // Command data
        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const cmdstr = args.shift().toLowerCase()

        let command = client.commands.get(cmdstr)
        if (!command) return

        let permissions = client.Data.getData(guildID, memberID).Permission

        // Developer
        if (command.devOnly && !developers.includes(memberID)) {
            return message.reply("This command is only available to the bot developers").then(msg => setTimeout(() => msg.delete(), 5000))
        }

        // General permission
        if (command.permission > permissions && !developers.includes(memberID)) {
            return message.reply("You do not have access to this command").then(msg => setTimeout(() => msg.delete(), 5000))
        }

        // Run command
        try {
            await command.run({bot, message, args})
        }
        catch(err) {
            let errMsg = err.toString()

            if (errMsg.startsWith("?")) {
                errMsg = errMsg.slice(1)
                await message.reply(errMsg).then((msg) => setTimeout(() => msg.delete(), 5000))
            }
            else console.error(err)
        }

        // Save
        client.Data.save()
    }
}
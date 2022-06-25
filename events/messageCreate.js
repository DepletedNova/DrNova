const Discord = require("discord.js")

module.exports = {
    name: "messageCreate",
    run: async function runAll(bot, message) {
        const {client, prefix, developers} = bot

        if (message.author.bot) return

        // Responses
        if (client.Data.Memory.Active[message.author.id])
        {
            var userData = client.Data.getUserData(client, client.Data.Memory.Active[message.author.id].Guild, message.author.id)
            if (userData != null && userData.Responding)
            {
                var response = client.responses.get(userData.ResponseType)
                if (response != null && ((response.privateOnly && !message.channel.guild) || !response.privateOnly))
                {
                    client.Data.setUserData(client, client.Data.Memory.Active[message.author.id].Guild, message.author.id, "Responding", false)
                    try { response.run(bot, message) } catch(err) { console.error(err) }
                }
            }
        }
        
        if (!message.channel.guild) return

        let member = message.member
        let memberID = member.id
        let guildID = message.channel.guild.id

        // Data
        client.Data.defaultUser(bot, memberID, guildID)

        // Credit
        if (message.content.startsWith('+') || message.content.startsWith('-'))
        {
            var amount = Number(message.content.slice(1).split(/ +/g)[0].trim())
            if (!isNaN(amount) && amount <= 3 && amount != 0) {
                let creditCooldown = client.Data.getGuildData(client, guildID).CreditCooldown
                let userCooldown = client.Data.getUserData(client, guildID, memberID).CreditCooldown
                if ((Date.now() - userCooldown)/1000 < creditCooldown) return message.reply(`Cooldown active: ${Math.ceil((Date.now() - userCooldown)/1000)}s`).then((msg) => 
                    setTimeout(() => msg.delete(), 10000))
                client.Data.getUserData(client, guildID, memberID).CreditCooldown = Date.now()

                try {
                    await client.handleCredit(bot, message, message.content.startsWith('+') ? amount : -amount)
                } catch(err) { console.error(err) }
            }
            else if (!isNaN(amount))
            {
                return message.reply('Values must range from `1` to `3`').then((msg) => setTimeout(() => msg.delete(), 5000))
            }
        }

        // Command prefix
        if (!message.content.startsWith(prefix)) return

        // Cooldown
        let commandCooldown = client.Data.getGuildData(client, guildID).CommandCooldown
        let userCooldown = client.Data.getUserData(client, guildID, memberID).CommandCooldown
        if ((Date.now() - userCooldown)/1000 < commandCooldown) return message.reply(`Cooldown active: ${Math.ceil((Date.now() - userCooldown)/1000)}s`).then((msg) => 
            setTimeout(() => msg.delete(), 10000))
        client.Data.getUserData(client, guildID, memberID).CommandCooldown = Date.now()

        // Command data
        const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g)
        const cmdstr = args.shift()

        let command = client.commands.get(cmdstr)
        if (!command) return
        setTimeout(() => message.delete(), 2000)

        // Developer
        if (command.devOnly && !developers.includes(memberID)) {
            return message.reply("This command is only available to the bot developers").then(msg => setTimeout(() => msg.delete(), 5000))
        }

        // Command permissions
        var hasPermission = true
        command.permissions.forEach((perm) => {
            if (!message.member.permissions.has(perm))
                hasPermission = false
        })
        if (!hasPermission && !developers.includes(memberID)) {
            return message.reply("You do not have access to this command").then(msg => setTimeout(() => msg.delete(), 5000))
        }

        // Run command
        try {
            await command.run({bot, message, args})
        } catch(err) {
            let errMsg = err.toString()

            if (errMsg.startsWith("?")) {
                errMsg = errMsg.slice(1)
                await message.reply(errMsg).then((msg) => setTimeout(() => msg.delete(), 5000))
            }
            else console.error(err)
        }

        client.Data.save(client)
    }
}
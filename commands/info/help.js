const { MessageEmbed } = require('discord.js')
const flags = require('../../util/flags')
module.exports = {
    name: "help",
    category: "info",
    description: "Gives back a list of commands",
    usage: `dr.help [(optional) command]`,
    permissions: [],
    devOnly: false,
    run: async ({bot, message, args}) => {
        const {client,developers} = bot
        
        if (args[0])
        {
            var cmd = client.commands.get(args[0].toLowerCase())
            if (!cmd) return message.reply("Command does not exist.").then((msg) => setTimeout(() => msg.delete(), 5000))
            var embed = new MessageEmbed().setColor('BLUE')
                .setTitle(cmd.name)
                .setDescription(cmd.description)
                .addField('Usage', `\`${cmd.usage}\``, true)
            if (cmd.devOnly)
                embed.addField("Developer Only", "\`true\`", true)
            if (cmd.permissions.length > 0)
            {
                var perms = ``
                cmd.permissions.forEach((perm) => perms += `\`${flags[perm]}\`, `)
                embed.addField("Permissions", perms.slice(0, -2))
            }
            message.reply({ embeds: [embed] })
        }
        else
        {
            var collection = {}
            for (let [name, command] of client.commands.entries())
            {
                var hasPermission = true
                command.permissions.forEach((perm) => {
                    if (!message.member.permissions.has(perm))
                        hasPermission = false
                })
                if (command.devOnly && !developers.includes(message.author.id))
                    hasPermission = false
                if (developers.includes(message.author.id))
                    hasPermission = true
                
                if (hasPermission)
                {
                    if (!collection[command.category]) collection[command.category] = []
                        collection[command.category].push(name)
                }
            }

            var embed = new MessageEmbed().setColor('BLUE')
                    .setTitle("Command List")
                    .setFooter({ text: `"dr.help command" will give you more info on any given command.` })
            
            for (let [category, commands] of Object.entries(collection))
            {
                var desc = ``
                commands.forEach((str) => {
                    desc += `\`${str}\`, `
                })
                desc = desc.slice(0, -2).toLowerCase()
                embed.addField(category.charAt(0).toUpperCase() + category.slice(1), desc)
            }

            message.reply({ embeds: [embed] })
            delete collection
        }
    }
}
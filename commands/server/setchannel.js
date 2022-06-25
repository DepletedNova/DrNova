const {Permissions} = require('discord.js')
module.exports = {
    name: "setchannel",
    category: "server",
    description: "Sets channel to the selected value",
    usage: `dr.setchannel \`logs\` \`[OPTIONAL] ID\``,
    permissions: [Permissions.FLAGS.MANAGE_CHANNELS],
    devOnly: false,
    run: async ({bot, message, args}) => {
        const {client} = bot
        if (!args[0]) return

        var channel = (args[1] && !isNaN(Number(args[1]))) ? await client.channels.fetch(Number(args[1])) : message.channel
        if (!channel) channel = message.channel

        if (args[0].includes('log'))
        {
            client.Data.Datastore.Guilds[message.channel.guild.id].LogChannel = channel.id
            message.reply(`Successfully set logging channel.`).then((msg) => setTimeout(() => msg.delete(), 5000))
        }

        client.Data.save(client)
    }
}
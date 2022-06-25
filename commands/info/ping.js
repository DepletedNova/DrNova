module.exports = {
    name: "ping",
    category: "info",
    description: "Sends back the bots ping",
    usage: `dr.ping`,
    permissions: [],
    devOnly: false,
    run: async ({bot, message, args}) => {
        const {client} = bot
        message.reply(`Pong!\n\`${Math.abs(Date.now() - message.createdTimestamp)}ms\` Bot Latency\n\`${Math.round(client.ws.ping)}ms\` API Latency`)
    }
}
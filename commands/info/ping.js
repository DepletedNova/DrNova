module.exports = {
    name: "ping",
    category: "info",
    description: "Sends back ping",
    usage: `dr.ping`,
    permission: 0,
    devOnly: false,
    run: async ({bot, message, args}) => {
        const {client} = bot
        message.reply(`Pong!\n\`${Math.abs(Date.now() - message.createdTimestamp)}ms\` Bot Latency\n\`${Math.round(client.ws.ping)}ms\` API Latency`)
    }
}
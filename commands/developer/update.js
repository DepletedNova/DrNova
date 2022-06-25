module.exports = {
    name: "update",
    category: "developer",
    description: "Properly updates the bot from Github",
    usage: `dr.update`,
    permissions: [],
    devOnly: true,
    run: async ({bot, message, args}) => {
        const {client} = bot
        const channel = message.channel
        const dat = new Date()
        client.gitUpdater.forceUpdate().then(async () => {
            await client.loadEvents(bot, true)
            await client.loadCommands(bot, true)
            await client.loadResponses(bot, true)
            await client.loadButtons(bot, true)
            await client.Data.reload(bot)
            console.log(`Update took ${Math.abs(Date.now() - dat)}ms`)
            message.send(`Updated bot in \`${Math.abs(Date.now() - dat)/1000}s\``)
            delete dat
        })
    }
}
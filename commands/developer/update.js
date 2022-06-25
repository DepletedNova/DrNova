module.exports = {
    name: "update",
    category: "developer",
    description: "Properly updates the bot from Github",
    usage: `dr.update`,
    permissions: [],
    devOnly: true,
    run: async ({bot, message, args}) => {
        const {client} = bot
        var dat = new Date()
        await client.gitUpdater.forceUpdate()
        await client.loadEvents(bot, true)
        await client.loadCommands(bot, true)
        await client.loadResponses(bot, true)
        await client.loadButtons(bot, true)
        await client.Data.reload(bot)
        //delete require.cache[require.resolve('.../handlers/credit')]
        //client.handleCredit = (bot, msg, amount) => require(".../handlers/credit")(bot, msg, amount)
        console.log(`Update took ${Math.abs(Date.now() - dat)}ms`)
        message.reply(`Updated bot in ${Math.abs(Date.now() - dat)}ms`).then
        delete dat
    }
}
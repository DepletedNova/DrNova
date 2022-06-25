module.exports = {
    name: "reload",
    category: "developer",
    description: "Reloads commands/events",
    usage: `dr.reload`,
    permissions: [],
    devOnly: true,
    run: async ({bot, message, args}) => {
        const {client} = bot
        var dat = new Date()
        await client.loadEvents(bot, true)
        await client.loadCommands(bot, true)
        await client.loadResponses(bot, true)
        await client.loadButtons(bot, true)
        await client.Data.reload(bot)
        //delete require.cache[require.resolve('.../handlers/credit')]
        //client.handleCredit = (bot, msg, amount) => require(".../handlers/credit")(bot, msg, amount)
        console.log(`Reload took ${Math.abs(Date.now() - dat)}ms`)
        message.reply(`Reloaded bot in ${Math.abs(Date.now() - dat)}ms`).then
        delete dat
    }
}
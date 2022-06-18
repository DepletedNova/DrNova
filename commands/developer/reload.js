module.exports = {
    name: "reload",
    category: "developer",
    description: "Reloads commands/events",
    usage: `dr.reload`,
    permission: 0,
    devOnly: true,
    run: async ({bot, message, args}) => {
        const {client} = bot
        var dat = new Date();
        await client.loadCommands(bot, true)
        await client.loadEvents(bot, true)
        await client.Data.reload(bot)
        delete require.cache[require.resolve('.../handlers/credit')]
        client.handleCredit = (bot, msg) => require(".../handlers/credit")(bot, msg)
        console.log(`Reload took ${Math.abs(Date.now() - dat)}ms`)
        message.reply("Reloaded commands and events.").then
        delete dat
    }
}
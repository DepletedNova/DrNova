module.exports = {
    name: "update",
    category: "developer",
    description: "Updates the bot based on Github",
    usage: `dr.update`,
    permissions: [],
    devOnly: true,
    run: async ({bot, message, args}) => {
        const {client} = bot
        
        client.gitUpdater.forceUpdate()
    }
}
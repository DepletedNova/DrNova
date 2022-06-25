module.exports = {
    name: "ready",
    run: async (bot) => {
        const {client} = bot
        console.log(`Logged in as ${client.user.tag}`)
        client.user.setPresence({ activities: [{ name: "for dr.help", type: 'WATCHING' }], status: 'online'});
        client.Data.load(client)
        setTimeout(() => client.Data.reload(bot), 500)
    }
}
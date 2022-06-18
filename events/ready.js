module.exports = {
    name: "ready",
    run: async (bot) => {
        const {client} = bot
        console.log(`Logged in as ${client.user.tag}`)
        client.user.setPresence({ activities: [{ name: "for dr.help", type: 'WATCHING' }], status: 'online'});
    }
}
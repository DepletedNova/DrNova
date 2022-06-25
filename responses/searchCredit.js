const { searchCreditReply, confirmCreditReply, cancelPrompt } = require("../util/functions")

module.exports = {
    privateOnly: true,
    run: async (bot, message) => {
        const {client} = bot

        var data = client.Data.Memory.Active[message.author.id]

        // Check if cancel
        if (message.content.toLowerCase().includes('cancel'))
            return cancelPrompt(client, message)
        
        // Search for user
        var guild = await client.guilds.fetch(data.Guild)
        var search = (await guild.members.fetch({ query: message.content, limit: 1 })).first()
        if (search && !search.user.bot && search.user.id != message.author.id)
        {
            client.Data.Memory.Active[message.author.id].Target = search.user.id
            confirmCreditReply(client, message)
        }
        else
        {
            client.Data.setUserData(client, data.Guild, message.author.id, "Responding", true)
            client.Data.setUserData(client, data.Guild, message.author.id, "ResponseType", "searchCredit")
            message.reply("No such user was found.")
            searchCreditReply(client, message.author)
        }
    }
}
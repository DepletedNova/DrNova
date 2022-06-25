module.exports = {
    defaultData: async function defaultData(bot)
    {
        const {client} = bot

        // Bot
        if (iNoUd(client.Data.Datastore.Guilds)) client.Data.Datastore.Guilds = {}

        // Guilds
        await client.guilds.cache.forEach((guild) => {
            if (iNoUd(client.Data.Datastore.Guilds[guild.id])) client.Data.Datastore.Guilds[guild.id] = {}

            if (iNoUd(client.Data.Datastore.Guilds[guild.id].LogChannel)) client.Data.Datastore.Guilds[guild.id].LogChannel = 0
            if (iNoUd(client.Data.Datastore.Guilds[guild.id].CommandCooldown)) client.Data.Datastore.Guilds[guild.id].CommandCooldown = 0
            if (iNoUd(client.Data.Datastore.Guilds[guild.id].CreditCooldown)) client.Data.Datastore.Guilds[guild.id].CreditCooldown = 120
            if (iNoUd(client.Data.Datastore.Guilds[guild.id].Users)) client.Data.Datastore.Guilds[guild.id].Users = {}

            for (let [id, data] of Object.entries(client.Data.Datastore.Guilds[guild.id].Users)) { this.defaultUser(bot, id, guild.id) }
        })

        await client.Data.save(client)
        console.log('Evaluated and saved data')
    },
    defaultUser: async function defaultUser(bot, id, guildid)
    {
        const {client} = bot

        if (iNoUd(client.Data.Datastore.Guilds[guildid].Users[id])) client.Data.Datastore.Guilds[guildid].Users[id] = {}
        
        // User Defaults
        if (iNoUd(client.Data.Datastore.Guilds[guildid].Users[id].Credit)) client.Data.setUserData(client, guildid, id, "Credit", 0)
        if (iNoUd(client.Data.Datastore.Guilds[guildid].Users[id].Responding)) client.Data.setUserData(client, guildid, id, "Responding", false)
        if (iNoUd(client.Data.Datastore.Guilds[guildid].Users[id].ResponseType)) client.Data.setUserData(client, guildid, id, "ResponseType", "")
        if (iNoUd(client.Data.Datastore.Guilds[guildid].Users[id].CommandCooldown)) client.Data.setUserData(client, guildid, id, "CommandCooldown", 0)
        if (iNoUd(client.Data.Datastore.Guilds[guildid].Users[id].CreditCooldown)) client.Data.setUserData(client, guildid, id, "CreditCooldown", 0)
    }
}

function iNoUd(val) { return (val === undefined || val === null) }
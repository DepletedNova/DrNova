module.exports = {
    defaultData: async function defaultData(bot)
    {
        const {client} = bot

        // Bot
        client.Data.Datastore.Guilds = Default(client.Data.Datastore.Guilds, {})
        client.Data.Datastore.Active = Default(client.Data.Datastore.Active, {})

        // Guilds
        client.guilds.cache.forEach((guild) => {
            client.Data.Datastore.Guilds[guild.id] = Default(client.Data.Datastore[guild.id], {})

            client.Data.Datastore.Guilds[guild.id].logChannel = Default(client.Data.Datastore.Guilds[guild.id].logChannel, 0)
            client.Data.Datastore.Guilds[guild.id].announcementChannel = Default(client.Data.Datastore.Guilds[guild.id].announcementChannel, 0)
            client.Data.Datastore.Guilds[guild.id].CMDCooldown = Default(client.Data.Datastore.Guilds[guild.id].CMDCooldown, 0)
            client.Data.Datastore.Guilds[guild.id].CreditCooldown = Default(client.Data.Datastore.Guilds[guild.id].CreditCooldown, 120)
            client.Data.Datastore.Guilds[guild.id].Users = Default(client.Data.Datastore.Guilds[guild.id].Users, {})

            for (const [id, data] of Object.entries(client.Data.Datastore.Guilds[guild.id].Users)) { 
                this.defaultUser(bot, id, guild.id)
            }
        })

        client.Data.save()
        console.log('Evaluated and saved data')
    },
    defaultUser: async function defaultUser(bot, id, guildid)
    {
        const {client} = bot
        // Player Defaults
        client.Data.setData(guildid, id, "Permission", Default(client.Data.getData(guildid, id).Permission, 0))
        client.Data.Datastore.Guilds[guildid].Users[id].Credit = Default(client.Data.Datastore.Guilds[guildid].Users[id].Credit, 0)
        client.Data.Datastore.Guilds[guildid].Users[id].Responding = Default(client.Data.Datastore.Guilds[guildid].Users[id].Responding, false)
        client.Data.Datastore.Guilds[guildid].Users[id].ResponseType = Default(client.Data.Datastore.Guilds[guildid].Users[id].ResponseType, "")
        client.Data.Datastore.Guilds[guildid].Users[id].SelectedUser = Default(client.Data.Datastore.Guilds[guildid].Users[id].SelectedUser, 0)
        client.Data.Datastore.Guilds[guildid].Users[id].Cooldown = Default(client.Data.Datastore.Guilds[guildid].Users[id].Cooldown, new Date(-9999999))

        // Set owner
    }
}

function Default(value, def) {return value == null ? def : value}
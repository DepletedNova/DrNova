const fs = require('fs');

module.exports = {
    Datastore: {},
    Memory: {
        Active: {},
        Collection: {},
    },
    save: function save(client) {
        fs.writeFile('./database.json', JSON.stringify(client.Data.Datastore), (err) => {
            if (err) throw err
        })
    },
    load: function load(client) {
        fs.readFile('./database.json', (err, data) => {
            if (err) throw err
            client.Data.Datastore = JSON.parse(data)
        })
    },
    reload: async function reload(bot) {
        const evaluate = require('../util/dataDefaults')
        evaluate.defaultData(bot)
        delete require.cache[require.resolve('../util/dataDefaults')]
    },
    defaultUser: async (client, id, guildid) => {
        const evaluate = require('../util/dataDefaults')
        evaluate.defaultUser(client, id, guildid)
        delete require.cache[require.resolve('../util/dataDefaults')]
    },
    getUserData: function gud(client, guildID, userID) { return client.Data.Datastore.Guilds[guildID].Users[userID] },
    setUserData: function sud(client, guildID, userID, value, input) { client.Data.Datastore.Guilds[guildID].Users[userID][value] = input },
    getGuildData: function ggd(client, guildID) { return client.Data.Datastore.Guilds[guildID] },
    setGuildData: function sgd(client, guildID, value, input) { client.Data.Datastore.Guilds[guildID][value] = input }
}
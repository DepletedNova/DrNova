const fs = require('fs')

module.exports = {
    Datastore: {},
    boot: async function boot(bot) { await this.load(); await this.reload(bot) },
    save: function save() {fs.writeFileSync('./database.json', JSON.stringify(this.Datastore), (err) => {if (err) throw err})},
    load: function load() {fs.readFileSync('./database.json', (err, data) => {if (err) throw err; this.Datastore = JSON.parse(data)})},
    reload: async function reload(bot)
    {
        const evaluate = require('../util/dataDefaults')
        evaluate.defaultData(bot)
        delete require.cache[require.resolve('../util/dataDefaults')]
    },
    defaultUser: async function defaultUser(bot, id, guildid)
    {
        const evaluate = require('../util/dataDefaults')
        evaluate.defaultUser(bot, id, guildid)
        delete require.cache[require.resolve('../util/dataDefaults')]
    },
    getData: function getData(guildID, userID) {return this.Datastore.Guilds[guildID].Users[userID]},
    setData: async function setData(guildID, userID, value, input) {this.Datastore.Guilds[guildID].Users[userID][value] = input}
}
const { getFiles } = require('../util/functions')
const fs = require('fs')

module.exports = (bot, reload) => {
    const {client} = bot
    
    getFiles(`./responses`, ".js").forEach((f) => {
        if (reload)
            delete require.cache[require.resolve(`../responses/${f}`)]
        client.responses.set(f.replace('.js', ''), require(`../responses/${f}`))
    })

    console.log(`Loaded ${client.responses.size} responses`)
}
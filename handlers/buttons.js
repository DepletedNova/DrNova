const { getFiles } = require('../util/functions')
const fs = require('fs')

module.exports = (bot, reload) => {
    const {client} = bot
    
    getFiles(`./buttons`, ".js").forEach((f) => {
        if (reload)
            delete require.cache[require.resolve(`../buttons/${f}`)]
        client.buttons.set(f.replace('.js', ''), require(`../buttons/${f}`))
    })

    console.log(`Loaded ${client.buttons.size} buttons`)
}
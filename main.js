const TESTING = true;

require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

let bot = {
    client,
    prefix: "dr.",
    developers: ["261666390279323648"],
}

client.commands = new Discord.Collection()
client.events = new Discord.Collection()
client.Data = require("./handlers/data")

// Load functions onto client
client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload)
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload)
client.handleCredit = (bot, msg, amount) => require("./handlers/credit")(bot, msg, amount)

// Event & Command init
client.loadEvents(bot, false)
client.loadCommands(bot, false)

module.exports = bot

client.login(TESTING ? process.env.TEST_TOKEN : process.env.TOKEN).then(() => client.Data.boot(bot))
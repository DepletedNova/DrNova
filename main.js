const TESTING = true;

require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] })

let bot = {
    client,
    prefix: "dr.",
    developers: ["261666390279323648"],
}

client.commands = new Discord.Collection()
client.events = new Discord.Collection()
client.buttons = new Discord.Collection()
client.responses = new Discord.Collection()
client.Data = require("./handlers/data")

// Load functions onto client
client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload)
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload)
client.loadResponses = (bot, reload) => require("./handlers/responses")(bot, reload)
client.loadButtons = (bot, reload) => require("./handlers/buttons")(bot, reload)
client.handleCredit = (bot, msg, amount) => require("./handlers/credit")(bot, msg, amount)

// Event & Command init
client.loadEvents(bot, false)
client.loadCommands(bot, false)
client.loadResponses(bot, false)
client.loadButtons(bot, false)

module.exports = bot

client.login(TESTING ? process.env.TEST_TOKEN : process.env.TOKEN)
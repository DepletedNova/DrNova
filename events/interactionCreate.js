module.exports = {
    name: "interactionCreate",
    run: async (bot, interaction) => {
        const {client} = bot
        // Buttons
        if (interaction.isButton())
        {
            let button = client.buttons.get(interaction.customId)
            if (!button) {
                console.error(`Button has not yet been implemented: ${interaction.customId}\n`)
                interaction.channel.send(`Button "${interaction.customId}" has not been implemented, yet.`)
            } else {
                try {
                    await button.run(bot, interaction)
                } catch(err) {console.error(err)}
            }
            return
        }
    }
}
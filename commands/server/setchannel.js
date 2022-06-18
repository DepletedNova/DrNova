module.exports = {
    name: "setchannel",
    category: "server",
    description: "Sets channel to the selected value",
    usage: `dr.setchannel \`logs | announcement\` \`[OPTIONAL] channelID\``,
    permission: 2,
    devOnly: false,
    run: async ({bot, message, args}) => {
        const {client} = bot
        // TODO: set logs
    }
}
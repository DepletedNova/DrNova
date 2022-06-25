module.exports = {
    name: "hamburger",
    category: "developer",
    description: "hamburg",
    usage: `dr.hamburger`,
    permissions: [],
    devOnly: true,
    run: async ({bot, message, args}) => {
        const {client} = bot
        
        console.log("Hamburger")
    }
}
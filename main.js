require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"] });

//! Data Management
var userData = {}
var serverdata = {}
var memory = {}

function SaveData()
{
    fs.writeFile('userdata.json', JSON.stringify(userData), err => {
        if (err) throw err;
    });
    fs.writeFile('serverdata.json', JSON.stringify(serverdata), err => {
        if (err) throw err;
    });
}
function ReadData()
{
    fs.readFile("userdata.json", (err, data) => {
        if (err) throw err;
        userData = JSON.parse(data);
    });
    fs.readFile("serverdata.json", (err, data) => {
        if (err) throw err;
        serverdata = JSON.parse(data);
    });
}
function CheckDefaultData(id)
{
    if (userData[id] == null)
    {
        userData[id] = {
            // Long-term data
            "points" : 0, // Social
            "level" : 0, // Administrative
        }
    }
    if (memory[id] == null)
    {
        memory[id] = {
            // Short-term data
            "id" : 0,
            "guild" : 0,
            "amount" : 0,
            "searching": false,
            "responding": false,
            "time": new Date(-999999),
        }
    }
}
function CheckServerDefault(id)
{
    if (serverdata[id] == null)
    {
        serverdata[id] = {
            "logChannel" : 0,
            "delay-s" : 150,
        }
    }
    SaveData();
}

//! Logging
async function LogData(author, target, reason, amount)
{
    var logEmbed = new Discord.MessageEmbed()
        .setColor(amount > 0 ? 'GREEN' : 'RED')
        .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
        .setTitle(`\`${amount > 0 ? '+' : '-'}${Math.abs(amount)}\` to ${target.user.tag}\t`)
        .setDescription(`${target.user.tag} now has \`${userData[target.user.id]["points"] > 0 ? '+' : '-'}${Math.abs(userData[target.user.id]["points"])
            }\` point${amount == 1 || amount == -1 ? "" : "s"}`)
        .addField("Reasoning", `"${reason.substring(0, 1000)}"`)
        .setThumbnail(target.user.avatarURL())
        .setTimestamp();
    
    for (let [guildID, data] of Object.entries(serverdata))
    {
        if (guildID != "undefined")
        {
            client.channels.fetch(serverdata[guildID]["logChannel"]).then(chnl => {
                chnl.send({embeds: [logEmbed]});
            });
        }
    }
}

//! On begin
client.on('ready', () =>
{
  ReadData();
  client.user.setPresence({ activities: [{ name: "for ~help", type: 'WATCHING' }], status: 'online'});
  console.log(`${client.user.tag} is now active`);
});

//! Generic Messages
function SendApplyMessage(msg, targeted, prefix, amount)
{
    memory[msg.author.id]["id"] = targeted.id;
    msg.author.send({
        embeds: [new Discord.MessageEmbed()
            .setColor('GOLD')
            .setAuthor({ name: targeted.nickname ? `${targeted.nickname} (${targeted.user.tag})` : targeted.user.tag})
            .setThumbnail(targeted.user.avatarURL({size:256}))
            .setTitle(`Would you like grant \`${prefix + Math.abs(amount)}\` to this person?`)
            .setDescription("Pressing no will prompt you to type in the targets username.")
            .setTimestamp()],
        components: [new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton().setCustomId("accept").setLabel('✔').setStyle('SUCCESS'),
                new Discord.MessageButton().setCustomId("deny").setLabel('✖').setStyle('DANGER'),
            )]
    });
}

//! Message Create
client.on('messageCreate', async msg =>
{
    // add default data
    CheckDefaultData(msg.author.id);
    CheckServerDefault(msg.channel.guildId);

    // Check if user is responding to the bot
    if ((memory[msg.author.id]["searching"] || memory[msg.author.id]["responding"]) && msg.content.toLowerCase().includes('cancel'))
    {
        memory[msg.author.id]["searching"] = false;
        memory[msg.author.id]["responding"] = false;
        var newEmbed = new Discord.MessageEmbed()
            .setColor('GOLD')
            .setAuthor({ name: msg.author.tag})
            .setThumbnail(msg.author.avatarURL({size:256}))
            .setTitle("Response closed.")
            .setFooter({text: 'This response will close shortly.'})
            .setTimestamp();
        await msg.channel.messages.fetch({ limit: 5}).then(x =>
            {
                var closed = false;
                x.forEach(message => {
                    if (message.author.id == client.user.id && !closed)
                    {
                        closed = true;
                        message.edit({embeds: [newEmbed], components: []}).then(m => {
                            setTimeout(() => m.delete(), 5000)
                        })
                    }
                });
            });
    }
    if (memory[msg.author.id]["searching"] && msg.channel.guild == null) // Find user
    {
        (await client.guilds.fetch(memory[msg.author.id]["guild"])).members.fetch({query: msg.content, limit: 1}).then(x =>
            {
                var user = x.first();
                if (user != null && user.user.id != msg.author.id)
                {
                    var amount = memory[msg.author.id]["amount"];
                    SendApplyMessage(msg, user, amount > 0 ? "+" : "-", amount);
                    memory[msg.author.id]["searching"] = false;
                }
                else
                {
                    msg.reply("Could not find user; please try again.").then(msg => {
                        setTimeout(() => msg.delete(), 2500);
                    })
                }
            });
    }
    if (memory[msg.author.id]["responding"] && msg.channel.guild == null) // Give reason
    {
        var target = await (await client.guilds.fetch(memory[msg.author.id]["guild"])).members.fetch(memory[msg.author.id]["id"])
        var newEmbed = new Discord.MessageEmbed()
            .setColor('GOLD')
            .setAuthor({ name: target.nickname ? `${target.nickname} (${target.user.tag})` : target.user.tag})
            .setThumbnail(target.user.avatarURL({size:256}))
            .setTitle("Response closed.")
            .setFooter({text: 'This response will close shortly.'})
            .setTimestamp();
        await msg.channel.messages.fetch({ limit: 5}).then(x => {
            var closed = false;
            x.forEach(message => {
                if (message.author.id == client.user.id && !closed)
                {
                    closed = true
                    message.edit({ embeds: [newEmbed], components: [] }).then(m => {
                        setTimeout(() => m.delete(), 5000)
                    })
                }
            });
        });
        CheckDefaultData(target.user.id);
        var amount = memory[msg.author.id]["amount"];
        userData[target.user.id]["points"] += amount;
        memory[msg.author.id]["responding"] = false;
        LogData(msg.author, target, msg.content, amount, memory[msg.author.id]["guild"])
    }

    // Return if no operators used
    if (!(msg.content.startsWith('~') || msg.content.startsWith('+') || msg.content.startsWith('-'))) return;

    // Reset searches
    memory[msg.author.id]["responding"] = false;
    memory[msg.author.id]["searching"] = false;

    // Generic variables
    var prefix = msg.content.substring(0, 1);
    var content = msg.content.toLowerCase().substring(1).split(" ");

    // Admin
    if (prefix == '~')
    {
        var level = userData[msg.author.id]["level"];
        //! User Commands
        if (level >= 0)
        {
            // Help
            if (content[0] == "help")
            {
                var embed = new Discord.MessageEmbed()
                    .setAuthor({ name: msg.author.tag, iconURL: msg.author.avatarURL() })
                    .setColor('GOLD')
                    .setTitle("Help Command")
                    .setThumbnail(client.user.avatarURL({size: 256}));
                if (level >= 0) embed
                    .addField("Help", 'Grants a list of commands\n~help')
                    .addField("Stats", 'Gives a list of your user stats\n~stats `user [optional]`')
                    .addField('Leaderboard', 'Prints the current leaderboard\n~leaderboard')
                if (level >= 1) embed
                    .addField("Timeout", 'Prevents the user from using commands for a period of time\n~timeout `user` `minutes`');
                if (level >= 2) embed
                    .addField('Setlogs', 'Sets logging channel to current channel\n~setlogs')
                    .addField('Promote', 'Promotes user\n~promote `user`')
                    .addField('Setdelay', 'Sets the point delay to a number in minutes\n~setdelay `seconds`')
                if (level >= 3) embed
                    .addField('Resetpoints','Resets all points\n~resetpoints')
                    .addField('Restart', 'Restarts the bot\n~restart');
                msg.reply({ embeds: [embed.setTimestamp()]})
            }

            // Stats
            if (content[0] == "stats")
            {
                var embed = new Discord.MessageEmbed()
                    .setColor('GOLD')
                    .setTimestamp()
                if (content[1] != null)
                {
                    var member = (await msg.guild.members.fetch({query: content[1], limit: 1})).first()
                    if (member != null)
                    {
                        CheckDefaultData(member.user.id)
                        var data = userData[member.user.id];
                        embed
                            .setAuthor({ name: member.nickname ? `${member.nickname} (${member.user.tag})` : member.user.tag})
                            .setThumbnail(member.user.avatarURL())
                            .setTitle(`Info - ${data["level"] == 0 ? "User" : data["level"] == 1 ? "Moderator" : data["level"] == 2 ? "Administrator" : "Creator"}`)
                            .addField("Points", `${data["points"] > 0 ? '+' : '-'}${data["points"]}`)
                    }
                }
                else
                {
                    var data = userData[msg.author.id];
                    embed
                        .setAuthor({ name: msg.author.tag})
                        .setThumbnail(msg.author.avatarURL())
                        .setTitle(`Info - ${data["level"] == 0 ? "User" : data["level"] == 1 ? "Moderator" : data["level"] == 2 ? "Administrator" : "Creator"}`)
                        .addField("Points", `${data["points"] > 0 ? '+' : '-'}${data["points"]}`)
                }
                msg.channel.send({ embeds: [embed] });
            }

            // Leaderboard
            if (content[0] == "leaderboard")
            {
                
            }
        }

        //! Mod Commands
        if (level >= 1)
        {
            // Timeout
            if (content[0] == "timeout")
            {
                if (content[1] != null && content[2] != null)
                {
                    var member = (await msg.guild.members.fetch({query: content[1], limit: 1})).first()
                    var num = Number(content[2])
                    if (member && num)
                    {
                        CheckDefaultData(member.user.id)
                        memory[member.user.id]["time"] = new Date(num * 60000);
                    }
                }
            }
        }

        //! Admin Commands
        if (level >= 2)
        {
            // Set Logging Channel
            if (content[0] == "setlogs")
            {
                serverdata[msg.channel.guildId]["logChannel"] = msg.channel.id;
                msg.reply("Logging channel set.").then(m => {setTimeout(() => m.delete(), 5000)});
            }

            // Promote
            if (content[0] == "promote")
            {
                if (content[1] != null)
                {
                    var member = (await msg.guild.members.fetch({query: content[1], limit: 1})).first()
                    if (member)
                    {
                        var dat = userData[member.user.id];
                        if (dat["level"] + 1 < level)
                        {
                            dat["level"] += 1;
                            member.user.send({embeds: [new Discord.MessageEmbed()
                                .setAuthor(msg.author.tag, msg.author.avatarURL())
                                .setTitle("You were promoted.")
                                .setColor('GOLD')
                                .setDescription(`You are now a **${dat["level"] == 1 ? "Moderator" : "Admin"}**`)]});
                        }
                    }
                }
            }
            
            // Set delay
            if (content[0] == "setdelay")
            {
                if (content[1] != null && Number(content[1]))
                {
                    serverdata[msg.channel.guildId]["delay-s"] = Number(content[1])
                    msg.reply("Server delay updated!").then(m => {setTimeout(() => m.delete(), 5000)});
                }
            }
        }

        //! Owner Commands
        if (level >= 3)
        {
            // Reset points
            if (content[0] == "resetpoints")
            {
                for (var [id, data] in Object.entries(userData)) {
                    data["points"] = 0
                }
                msg.reply("All points reset.").then(m => {setTimeout(() => m.delete(), 5000)});
            }
            //TODO restart bot
        }
        setTimeout(() => msg.delete(), 1000);
    }

    // Social
    if (prefix == '-' || prefix == '+')
    {
        // Check time
        var currentTime = new Date();
        var timeDifference = currentTime.getTime() - memory[msg.author.id]["time"].getTime()
        if (timeDifference / 1000 < serverdata[msg.channel.guildId]["delay-s"]) return;
        memory[msg.author.id]["time"] = currentTime;

        var amount = Number(content[0]);
        if (amount == null || amount > 8 || amount <= 0) return;
        memory[msg.author.id]["amount"] = prefix == '+' ? Math.abs(amount) : -(Math.abs(amount))

        msg.react("👍");

        var lastUserID = 0;
        await msg.channel.messages.fetch({ limit: 10 }).then( x => {
            x.forEach(message => {
                if (message.author.id != msg.author.id && lastUserID == 0 && !message.author.bot) lastUserID = message.author.id;
            })

            if (lastUserID != 0)
            {
                msg.guild.members.fetch(lastUserID).then(targeted => {
                    memory[msg.author.id]["guild"] = msg.channel.guildId;
                    SendApplyMessage(msg, targeted, prefix, amount)
                });
            }
            else
            {
                memory[msg.author.id]["guild"] = msg.channel.guildId;
                var embed = new Discord.MessageEmbed()
                    .setColor('GOLD')
                    .setTitle(`Who do you wish to grant \`${amount > 0 ? "+" : "-"}${Math.abs(amount)}\` to?`)
                    .setDescription("Username or nickname are both acceptable")
                    .setAuthor({name: msg.author.tag, iconURL: msg.author.avatarURL()})
                    .setFooter({text: 'Type "cancel" to cancel this prompt.'})
                    .setTimestamp()
                msg.author.send({ content: "Could not find any players by default.", embeds: [embed]});
                memory[msg.author.id]["searching"] = true;
            }
            return;
        });
    }
    SaveData();
});

//! Button handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId == "deny")
    {
        var amount = memory[interaction.user.id]["amount"];
        var newEmbed = new Discord.MessageEmbed()
            .setColor('GOLD')
            .setTitle(`Who do you wish to grant \`${amount > 0 ? "+" : "-"}${Math.abs(amount)}\` to?`)
            .setDescription("Username or nickname are both acceptable.")
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()})
            .setFooter({text: 'Type "cancel" to cancel this prompt.'})
            .setTimestamp();
        interaction.message.edit({ embeds: [newEmbed], components: []});
        memory[interaction.user.id]["searching"] = true;
    }
    else if (interaction.customId == "accept")
    {
        var guild = await client.guilds.fetch(memory[interaction.user.id]["guild"]);
        var user = await guild.members.fetch(memory[interaction.user.id]["id"]);
        var newEmbed = new Discord.MessageEmbed()
            .setColor('GOLD')
            .setAuthor({ name: user.nickname ? `${user.nickname} (${user.user.tag})` : user.user.tag})
            .setThumbnail(user.user.avatarURL({size:256}))
            .setTitle("What is your reasoning?")
            //.setDescription("The community can overturn an unpopular reason.") //TODO community log polls
            .setFooter({text: 'Type "cancel" to cancel this prompt.'})
            .setTimestamp();
        interaction.message.edit({ embeds: [newEmbed], components: [] });
        memory[interaction.user.id]["responding"] = true;
    }
});

//! Login
client.login(process.env.CLIENT_TOKEN);
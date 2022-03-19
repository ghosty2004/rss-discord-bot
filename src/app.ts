import Discord from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import commands from "./commands";
import { token, prefix } from "./constants";
import * as functions from "./functions";

const bot = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]});
bot.login(token);

bot.on("ready", async () => {
    console.log(`${bot.user.tag} is ready !`);
    functions.init(bot).then(() => {
        functions.guildLogsChecker();
    });

    const tempCommands = [];
    commands.forEach((command) => { tempCommands.push(command.data().toJSON()); }); 

    const rest = new REST({version: '9'}).setToken(token);   
    bot.guilds.cache.forEach((guild) => {
        functions.checkGuild(guild);
        rest.get(Routes.applicationGuildCommands(bot.user.id, guild.id)).then(async(data) => {
            await rest.put(
                Routes.applicationGuildCommands(bot.user.id, guild.id), {
                    body: tempCommands
                },
            ).then(() => {
                console.log(`Successfully updated slash commands from guild: ${guild.name}.`);
            }).catch((e) => {
                console.log(`Could not update slash commands from developer guild: ${guild.name}.`);
                console.log(e.message);
            });   
        }); 
    });
});

bot.on("guildCreate", (guild) => {
    functions.checkGuild(guild);
});

bot.on("guildDelete", (guild) => {
    functions.removeGuild(guild.id);
});

bot.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return;
    const result = commands.find(f => f.data().name == interaction.commandName);
    if(!result) return;
    await interaction.deferReply();
    result.execute(interaction);
});
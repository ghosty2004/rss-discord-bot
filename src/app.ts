import Discord from "discord.js";

import commands from "./commands";
import { token } from "./constants";
import * as functions from "./functions";

const bot = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]});
bot.login(token);

bot.on("ready", async () => {
    console.log(`${bot.user.tag} is ready !`);
    functions.init(bot).then(() => {
        functions.guildLogsChecker();
    });

    bot.guilds.cache.forEach((guild) => {
        functions.checkGuild(guild);
    });

    setInterval(async() => {
        const serverStats = await functions.getServerStats();
        bot.user.setActivity({type: "PLAYING", name: `${serverStats.onlinePlayers}/${serverStats.maxPlayers} players`});
    }, 5000);
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
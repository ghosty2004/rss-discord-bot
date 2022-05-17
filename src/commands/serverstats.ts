import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getServerStats } from "../functions";

export default {
    data: () => {
        const slashCommand = new SlashCommandBuilder();
        slashCommand.setName("serverstats");
        slashCommand.setDescription("Server Stats");
        return slashCommand;
    },
    async execute(interaction: CommandInteraction) {
        const serverStats = await getServerStats();
        const embed = new MessageEmbed();
        embed.setColor("RANDOM");
        embed.setTitle("Server Stats");
        embed.addField("Online Players:", `${serverStats.onlinePlayers}/${serverStats.maxPlayers}`);
        embed.addField("Most players today:", `${serverStats.mostPlayersToday}`);
        embed.addField("DNS Address:", serverStats.DNS);
        embed.addField("IP Address:", serverStats.IP);
        interaction.editReply({embeds: [embed]});
    }
}
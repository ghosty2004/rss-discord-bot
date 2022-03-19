import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getPlayerStats } from "../functions";

export default {
    data: () => {
        const slashCommand = new SlashCommandBuilder();
        const stringOptions = new SlashCommandStringOption();

        slashCommand.setName("stats");
        slashCommand.setDescription("Show someone's stats"); 

        stringOptions.setName("name");
        stringOptions.setDescription("Name of the specific user");
        stringOptions.setRequired(true);

        slashCommand.addStringOption(stringOptions);
        
        return slashCommand;
    },
    execute(interaction: CommandInteraction) {
        const name = interaction.options.get("name").value.toString();
        getPlayerStats(name).then((data) => {
            const embed = new MessageEmbed();
            embed.setColor("ORANGE");
            embed.setTitle("Stats");
            embed.addField("Name:", data.name);
            embed.addField("Online:", data.online);
            embed.addField("Forum Account:", data.forumAccount);
            embed.addField("VIP:", data.VIP);
            embed.addField("Admin:", data.admin);
            embed.addField("Money:", data.money);
            embed.addField("Coins:", data.coins);
            embed.addField("Kills:", data.kills);
            embed.addField("Deaths:", data.deaths);
            embed.addField("Online Time:", data.onlineTime);
            embed.addField("Drift Points:", data.driftPoints);
            embed.addField("Race Points:", data.racePoints);
            embed.addField("Stunt Points:", data.stuntPoints);
            embed.addField("Respect:", data.respect);
            embed.addField("Properties:", data.properties);
            embed.addField("Gang:", data.gang);
            embed.addField("Gems:", data.gems);
            embed.addField("Stats Note:", data.statsNote);
            interaction.editReply({ embeds: [embed] });
        }).catch((error) => { interaction.editReply({ content: error }); });
    }
}
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getGangsList } from "../functions";

export default {
    data: () => {
        const slashCommand = new SlashCommandBuilder();
        
        slashCommand.setName("gangs");
        slashCommand.setDescription("Show Gangs List"); 

        return slashCommand;
    },
    execute(interaction: CommandInteraction) {
        getGangsList().then((data) => {
            let ranks = "", names = "", points = "";
            data.forEach((value) => {
                ranks += `\n${value.rank}`;
                names += `\n${value.name}`;
                points += `\n${value.points}`;
            });
            const embed = new MessageEmbed();
            embed.setColor("ORANGE");
            embed.setTitle(`Gang List (${data.length} Total)`);
            embed.addField("Rank:", ranks, true);
            embed.addField("Name:", names, true);
            embed.addField("Points:", points, true);
            interaction.editReply({embeds: [embed]});
        }).catch((error) => { interaction.editReply({ content: error }); });
    }
}
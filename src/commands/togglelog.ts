import { SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { logTypes } from "../constants";
import { editGuildVariable, getGuildVariable } from "../functions";

export default {
    data: () => {
        const slashCommand = new SlashCommandBuilder();
        const channelOption = new SlashCommandChannelOption();
        const stringOptions = new SlashCommandStringOption();

        slashCommand.setName("togglelog");
        slashCommand.setDescription("Enable or Disable a specific log"); 

        channelOption.setRequired(true);
        channelOption.setName("channel");
        channelOption.setDescription("Choose a channel");
        slashCommand.addChannelOption(channelOption);
        
        stringOptions.setRequired(true);
        stringOptions.setName("type");
        stringOptions.setDescription("Select a log type");

        logTypes.forEach((value) => {
            stringOptions.addChoice(value, value);
        });

        slashCommand.addStringOption(stringOptions);

        return slashCommand;
    },
    execute(interaction: CommandInteraction) {
        const logChannel = interaction.options.get("channel").channel;
        const logType = interaction.options.get("type").value.toString();
        let currentValue = getGuildVariable(interaction.guild, logType);
        if(currentValue == logChannel.id) currentValue = null;
        else currentValue = logChannel.id;
        editGuildVariable(interaction.guild, logType, currentValue);
        interaction.editReply({ content: `**${logType}** have been modified to: **${currentValue ? logChannel : "disabled"}** !` });
    }
}
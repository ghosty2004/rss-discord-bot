import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { topTypes } from "../constants";
import { getTopListImage } from "../functions";

export default {
    data: () => {
        const slashCommand = new SlashCommandBuilder();
        const stringOptions = new SlashCommandStringOption();

        slashCommand.setName("top");
        slashCommand.setDescription("Show top list of something");

        stringOptions.setRequired(true);
        stringOptions.setName("type");
        stringOptions.setDescription("Select a top type");
        
        topTypes.forEach((value) => {
            stringOptions.addChoice(value, value);
        });

        slashCommand.addStringOption(stringOptions);

        return slashCommand;
    },
    execute(interaction: CommandInteraction) {
        const topType = interaction.options.get("type").value.toString();
        getTopListImage(topType).then((bufferImage) => {
            interaction.editReply({files: [bufferImage]});
        });
    }
}
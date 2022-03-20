import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getTopListImage } from "../functions";

export default {
    data: () => {
        const slashCommand = new SlashCommandBuilder();
        slashCommand.setName("top");
        slashCommand.setDescription("Show top 3");
        return slashCommand;
    },
    execute(interaction: CommandInteraction) {
        getTopListImage().then((bufferImage) => {
            interaction.editReply({files: [bufferImage]});
        });
    }
}
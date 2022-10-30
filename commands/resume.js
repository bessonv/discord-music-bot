const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Снять с паузы'),
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply('В очереди нет песен');
            return;
        }

        queue.setPaused(false);

        await interaction.reply('Песня снята с паузы');
    }
}

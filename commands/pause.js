const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Поставить на паузу'),
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply('В очереди нет песен');
            return;
        }

        queue.setPaused(true);

        await interaction.reply('Песня поставлена на паузу');
    }
}

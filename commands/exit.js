const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exit')
        .setDescription('Выгнать из голосового канала'),
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply('В очереди нет песен');
            return;
        }

        queue.destroy();

        await interaction.reply('Ну я пошёл');
    }
}

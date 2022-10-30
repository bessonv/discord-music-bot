const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Пропустить песню'),
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply('В очереди нет песен');
            return;
        }

        const currentSong = queue.current;

        queue.skip();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Пропуск **${currentSong.title}**`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}

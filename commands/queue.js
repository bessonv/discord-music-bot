const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Показать первые 10 песен в очереди'),
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        if(!queue || !queue.playing) {
            await interaction.replay('В очереди нет песен')
            return;
        }

        const queueString = queue.tracks.slice(0, 10).map((song, i) => {
            return `${i + 1}) \`[${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;
        }).join("\n");

        const currentSong = queue.current;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Сейчас играет:**\n` +
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") +
                        `\n\n**Очередь**\n${queueString.length ? queueString : 'пуста'}`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}

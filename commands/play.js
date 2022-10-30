const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Играть песню')
        .addSubcommand(subcommand => (
            subcommand
                .setName('search')
                .setDescription('Искать песню')
                .addStringOption(option => (
                    option
                        .setName('searchterms')
                        .setDescription('искать по словам')
                        .setRequired(true)
                ))
        ))
        .addSubcommand(subcommand => (
            subcommand
                .setName('playlist')
                .setDescription('Играть youtube плейлист')
                .addStringOption(option => (
                    option
                        .setName('url')
                        .setDescription('ссылка на плейлист')
                        .setRequired(true)
                ))
        ))
        .addSubcommand(subcommand => (
            subcommand
                .setName('song')
                .setDescription('Играть песню с youtube')
                .addStringOption(option => (
                    option
                        .setName('url')
                        .setDescription('ссылка на песню')
                        .setRequired(true)
                ))
        )),
    execute: async ({client, interaction}) => {
        if (!interaction.member.voice.channel) {
            await interaction.reply('Нужно быть в глосовом канале чтобы использовать эту команду');
            return;
        }

        const queue = await client.player.createQueue(interaction.guild);

        if (!queue.connection) {
            await queue.connect(interaction.member.voice.channel)
        }

        // const queue = await queue.connect(interaction.member.voice.channel)

        // let embed = new MessageEmbed()
        let embed = new EmbedBuilder();

        if (interaction.options.getSubcommand() === 'song') {
            let url = interaction.options.getString('url');

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                seachEngine: QueryType.YOUTUBE_VIDEO,
            });

            if (result.tracks.length === 0) {
                return interaction.reply('Ничего не нашлось по ссылке');
            }

            const song = result.tracks[0]
            await queue.addTrack(song);

            embed
                .setDescription(`**[${song.title}](${song.url})** добавлено в очередь`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Длительность ${song.duration}`});
        } else if (interaction.options.getSubcommand() === 'playlist') {
            let url = interaction.options.getString('url');

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                seachEngine: QueryType.YOUTUBE_PLAYLIST,
            });

            if (result.tracks.length === 0) {
                await interaction.reply('Ничего не нашлось по ссылке');
                return;
            }

            const playlist = result.playlist;
            await queue.addTracks(result.tracks);

            embed
                .setDescription(`**[${playlist.title}](${playlist.url})** добавлено в очередь`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({text: `Длительность ${playlist.duration}`});
        } else if (interaction.options.getSubcommand() === 'seach') {
            let url = interaction.options.getString('searchterms');

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                seachEngine: QueryType.AUTO,
            });

            if (result.tracks.length === 0) {
                await interaction.reply('Ничего не нашлось');
                return;
            }

            const song = result.tracks[0];
            await queue.addTracks(song);

            embed
                .setDescription(`**[${song.title}](${song.url})** добавлено в очередь`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Длительность ${song.duration}`});
        }

        if (!queue.playing) await queue.play();

        await interaction.reply({
            embeds: [embed]
        })
    }
}

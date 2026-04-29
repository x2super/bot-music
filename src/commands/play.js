const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("เล่นเพลง")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("ชื่อเพลงหรือลิงก์เพลงของคุณ")
                .setRequired(true)
        ),
    async execute(client, interaction) {
        try {
            await interaction.deferReply();

            if (!interaction.member.voice.channelId) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xffffff)
                            .setDescription("> `❌` คุณต้องอยู่ในห้องเสียงก่อนเปิดเพลงนะคะ !"),
                    ],
                });
            }

            let player = client.manager.players.get(interaction.guild.id);

            if (!player) {
                player = client.manager.create({
                    node: interaction.options.getString("node") || undefined,
                    guild: interaction.guild.id,
                    voiceChannel: interaction.member.voice.channelId,
                    textChannel: interaction.channel.id,
                    volume: 80,
                    selfDeafen: true,
                    selfMute: false,
                });
            }

            if (player.state !== "CONNECTED") {
                player.connect();
            }

            const result = await client.manager.search(interaction.options.getString("query"), interaction.user);

            switch (result.loadType) {
                case "error":
                case "empty":
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xffffff)
                                .setDescription("> `❌` ไม่พบเพลงที่คุณกำลังค้นหาอยู่ตอนนี้ค่ะ !"),
                        ],
                    });
                    break;

                case "playlist":
                    player.queue.add(result.playlist.tracks);
                    if (!player.playing) player.play();

                    const playlist = result.playlist;
                    const totalDuration = result.playlist.tracks.reduce((acc, track) => acc + (track?.duration || 0), 0);
                    
                    const playlistEmbed = new EmbedBuilder()
                        .setColor(0xffffff)
                        .setTitle(`📚 ${playlist?.name || 'Unknown Playlist'}`)
                        .setURL(playlist?.tracks[0]?.uri || '#')
                        .setDescription(`เพิ่ม **${playlist?.tracks?.length || 0}** เพลงในคิว\n⏱️ ระยะเวลาทั้งหมด: \`${formatDuration(totalDuration)}\`\n└ เพิ่มโดย ${interaction.user}`)
                        .setFooter({ text: `[⭐] Node: ${player.node.options.identifier}` });

                    if (playlist?.tracks?.[0]?.artworkUrl || playlist?.tracks?.[0]?.thumbnail) {
                        playlistEmbed.setThumbnail(playlist.tracks[0].artworkUrl || playlist.tracks[0].thumbnail);
                    }

                    await interaction.editReply({ embeds: [playlistEmbed] });
                    break;

                default:
                    player.queue.add(result.tracks[0]);
                    if (!player.playing) player.play();

                    const track = result.tracks[0];
                    const trackEmbed = new EmbedBuilder()
                        .setColor(0xffffff)
                        .setTitle(`> หนูเพิ่มเพลงเรียบร้อยแล้วค่ะ`)
                        .setDescription(`- [${track?.title || 'Unknown'}](${track?.uri || '#'}) \n \`${formatDuration(track?.duration || 0)}\` - ${track?.author || 'Unknown'}\n └ เพิ่มโดย ${interaction.user}`)
                        .setFooter({ text: `[⭐] Node: ${player.node.options.identifier}` });

                    if (track?.artworkUrl || track?.thumbnail) {
                        trackEmbed.setThumbnail(track.artworkUrl || track.thumbnail);
                    }

                    await interaction.editReply({ embeds: [trackEmbed] });
                    break;
            }
        } catch (error) {
            console.error('Play command error:', error);
            
            try {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xffffff)
                            .setDescription(`> \`❌\` เกิดข้อผิดพลาด: ${error.message || "ไม่สามารถเล่นเพลงได้"}`),
                    ],
                });
            } catch (editError) {
                console.error('Failed to send error message:', editError);
            }
        }
    }
};
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("ข้ามเพลงปัจจุบัน"),
    async execute(client, interaction) {
        await interaction.deferReply();

        if (!interaction.member.voice.channelId) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription("> `❌` คุณต้องอยู่ในห้องเสียงก่อนใช้คำสั่งนี้นะคะ !"),
                ],
            });
        }

        const player = client.manager.players.get(interaction.guild.id);

        if (!player) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription("> `❌` ไม่มีเพลงที่กำลังเล่นอยู่ในขณะนี้ค่ะ !"),
                ],
            });
        }

        if (!player.playing && !player.paused) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription("> `❌` ไม่มีเพลงที่กำลังเล่นอยู่ค่ะ !"),
                ],
            });
        }

        try {
            const currentTrack = player.queue.current;
            player.stop();

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription(`> \`⏭️\` ข้ามเพลง **${currentTrack.title}** เรียบร้อยแล้วค่ะ !`),
                ],
            });
        } catch (error) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription(`> \`❌\` เกิดข้อผิดพลาด: ${error.message || "ไม่สามารถข้ามเพลงได้"}`),
                ],
            });
        }
    }
};

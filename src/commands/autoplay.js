const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autoplay")
        .setDescription("เปิด/ปิดการเล่นเพลงอัตโนมัติ"),
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

        try {
            player.isAutoplay = !player.isAutoplay;

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription(`> \`🎵\` ${player.isAutoplay ? "เปิด" : "ปิด"}การเล่นเพลงอัตโนมัติเรียบร้อยแล้วค่ะ !`),
                ],
            });
        } catch (error) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription(`> \`❌\` เกิดข้อผิดพลาด: ${error.message || "ไม่สามารถตั้งค่า autoplay ได้"}`),
                ],
            });
        }
    }
};

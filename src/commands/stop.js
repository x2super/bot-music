const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("หยุดเล่นเพลงและล้างคิว"),
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
            player.queue.clear();
            player.stop();
            
            setTimeout(() => {
                if (!player.playing && !player.paused && player.queue.size === 0) {
                    player.destroy();
                }
            }, 1000);

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription("> `⏹️` หยุดเล่นเพลงและล้างคิวเรียบร้อยแล้วค่ะ !"),
                ],
            });
        } catch (error) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription(`> \`❌\` เกิดข้อผิดพลาด: ${error.message || "ไม่สามารถหยุดเพลงได้"}`),
                ],
            });
        }
    }
};

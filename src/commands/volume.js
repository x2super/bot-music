const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("ปรับระดับเสียง")
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("ระดับเสียง (0-100)")
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
        ),
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

        const volume = interaction.options.getInteger("amount");

        try {
            player.setVolume(volume);

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription(`> \`🔊\` ปรับระดับเสียงเป็น **${volume}%** เรียบร้อยแล้วค่ะ !`),
                ],
            });
        } catch (error) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription(`> \`❌\` เกิดข้อผิดพลาด: ${error.message || "ไม่สามารถปรับระดับเสียงได้"}`),
                ],
            });
        }
    }
};

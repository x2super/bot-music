const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("เปิด/ปิดการเล่นเพลงซ้ำ")
        .addStringOption(option =>
            option.setName("mode")
                .setDescription("โหมดการเล่นซ้ำ")
                .setRequired(true)
                .addChoices(
                    { name: "เล่นเพลงปัจจุบันซ้ำ", value: "track" },
                    { name: "เล่นคิวทั้งหมดซ้ำ", value: "queue" },
                    { name: "ปิดการเล่นซ้ำ", value: "off" }
                )
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

        const mode = interaction.options.getString("mode");

        try {
            let loopMode;
            let description;

            switch (mode) {
                case "track":
                    player.setTrackRepeat(true);
                    player.setQueueRepeat(false);
                    description = "> `🔂` เปิดการเล่นเพลงปัจจุบันซ้ำเรียบร้อยแล้วค่ะ !";
                    break;
                case "queue":
                    player.setTrackRepeat(false);
                    player.setQueueRepeat(true);
                    description = "> `🔁` เปิดการเล่นคิวทั้งหมดซ้ำเรียบร้อยแล้วค่ะ !";
                    break;
                case "off":
                    player.setTrackRepeat(false);
                    player.setQueueRepeat(false);
                    description = "> `🔇` ปิดการเล่นซ้ำเรียบร้อยแล้วค่ะ !";
                    break;
            }

            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription(description),
                ],
            });
        } catch (error) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription(`> \`❌\` เกิดข้อผิดพลาด: ${error.message || "ไม่สามารถตั้งค่าการเล่นซ้ำได้"}`),
                ],
            });
        }
    }
};

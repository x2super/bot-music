const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

function formatDurationMs(msValue) {
    if (!Number.isFinite(msValue)) return "N/A";
    const totalSeconds = Math.floor(msValue / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function formatMb(bytes) {
    if (!Number.isFinite(bytes)) return "N/A";
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nodes")
        .setDescription('สถานะเครื่องเล่นเพลงของ Lavalink')
        .setDMPermission(false),

    async execute(client, interaction) {
        await interaction.deferReply();

        const nodeValues = client?.manager?.nodes?.values ? Array.from(client.manager.nodes.values()) : [];
        if (!nodeValues.length) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setDescription("> `❌` ไม่พบเครื่องเล่นเพลงที่พร้อมใช้งานตอนนี้ !"),
                ],
            });
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username} | สถานะเครื่องเล่นเพลง`, iconURL: client.user.displayAvatarURL() })
            .setColor(0xffffff)
            .setTitle("Lavalink Node Status")
            .addFields(
                nodeValues.map((node) => {
                    const connected = !!node.connected;
                    const statusEmoji = connected ? "`🟢`" : "`🔴`";
                    const identifier = node?.options?.identifier ?? node?.address ?? "Unknown";
                    const stats = node.stats || {};

                    const cpuPercent = Number.isFinite(stats?.cpu?.lavalinkLoad) ? (stats.cpu.lavalinkLoad * 100).toFixed(2) : "N/A";
                    const cores = stats?.cpu?.cores ?? "N/A";
                    const ramUsed = formatMb(stats?.memory?.used);
                    const uptime = formatDurationMs(stats?.uptime ?? 0);

                    return {
                        inline: true,
                        name: `${statusEmoji} ${identifier}`,
                        value: "```\n" +
                            `Connected : ${connected ? "Online" : "Offline"}\n` +
                            `Playing   : ${stats.playingPlayers ?? 0}\n` +
                            `CPU        : ${cpuPercent} %\n` +
                            `Core       : ${cores}\n` +
                            `RAM        : ${ramUsed}\n` +
                            `Uptime     : ${uptime}\n` +
                            "```",
                    };
                })
            );

        await interaction.editReply({ embeds: [embed] });
    },
};

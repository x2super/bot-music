const { Events } = require("discord.js");

module.exports = {
    execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                interaction.followUp({ content: "เกิดข้อผิดพลาดในการรันคำสั่งนี้", ephemeral: true });
            } else {
                interaction.reply({ content: "เกิดข้อผิดพลาดในการรันคำสั่งนี้", ephemeral: true });
            }
        }
    }
};

const logger = require('../utils/logger');

module.exports = {
    execute(client) {
        client.manager.on("nodeCreate", (node) => {
            logger.node(`Node created: ${node.options.identifier} (${node.address})`);
        });

        client.manager.on("nodeConnect", (node) => {
            logger.success(`Node connected: ${node.options.identifier} (${node.address})`);
        });

        client.manager.on("nodeDisconnect", (node, reason) => {
            logger.warning(`Node disconnected: ${node.options.identifier}`);
            logger.warning(`Reason code: ${reason.code}, Reason: ${reason.reason || "No reason"}`);
        });

        client.manager.on("nodeError", (node, error) => {
            logger.error(`Node error on ${node?.options?.identifier || "unknown"}: ${error.message || error}`);
        });

        client.manager.on("nodeReconnect", (node) => {
            logger.warning(`Node reconnecting: ${node.options.identifier} (Attempt: ${node.reconnectAttempts})`);
        });

        client.manager.on("trackStart", (player, track) => {
            logger.music(`Started playing in guild ${player.guild}: ${track.title}`);
        });

        client.manager.on("trackEnd", (player, track, payload) => {
            logger.music(`Track ended in guild ${player.guild}: ${track?.title || "Unknown"}`);
            if (payload?.reason) logger.music(`Reason: ${payload.reason}`);
        });

        client.manager.on("trackError", (player, track, payload) => {
            logger.error(`Track error in guild ${player.guild}: ${payload.reason || "Unknown error"}`);
        });

        client.manager.on("trackStuck", (player, track, payload) => {
            logger.warning(`Track stuck in guild ${player.guild}: ${track?.title || "Unknown"}`);
        });

        client.manager.on("queueEnd", (player) => {
            logger.music(`Queue ended in guild ${player.guild}`);
            player.destroy();
        });

        client.manager.on("playerMove", (player, oldChannel, newChannel) => {
            logger.voice(`Player moved in guild ${player.guild}: ${oldChannel} → ${newChannel}`);
        });

        client.manager.on("playerDisconnect", (player, channel) => {
            logger.voice(`Player disconnected from ${channel} in guild ${player.guild}`);
            player.destroy();
        });

        client.manager.on("socketClosed", (player, payload) => {
            logger.voice(`Socket closed in guild ${player.guild}: Code ${payload.code}, Reason: ${payload.reason || "No reason"}`);
        });

        client.manager.on("nodeRaw", (payload) => {
            // Only log important events, not every single message
            if (payload.op === "event" && (payload.type === "TrackStartEvent" || payload.type === "TrackEndEvent" || payload.type === "WebSocketClosedEvent")) {
                logger.music(`Node event: ${payload.type} in guild ${payload.guildId}`);
            }
        });

        client.on("voiceStateUpdate", (oldState, newState) => {
            if (newState.id === client.user.id) {
                logger.voice(`Bot voice state update in guild ${newState.guild.id}`);
                logger.voice(`Channel: ${newState.channelId}, Session: ${newState.sessionId}`);
            }
            client.manager.updateVoiceState({
                t: newState.channelId ? "VOICE_STATE_UPDATE" : "VOICE_STATE_UPDATE",
                d: {
                    guild_id: newState.guild.id,
                    user_id: newState.id,
                    channel_id: newState.channelId,
                    session_id: newState.sessionId
                }
            });
        });

        client.on("raw", (packet) => {
            if (packet.t === "VOICE_SERVER_UPDATE") {
                logger.voice(`Voice server update for guild ${packet.d.guild_id}`);
                logger.voice(`Endpoint: ${packet.d.endpoint}`);
                client.manager.updateVoiceState(packet);
            }
        });

        logger.success("Lavalink manager events registered");
    }
};

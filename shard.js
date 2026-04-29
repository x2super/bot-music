const { Client, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
const { Manager } = require("kawalink");
const fs = require("fs");
const path = require("path");
const { token, nodes } = require('./config.json');
const logger = require('./src/utils/logger');

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`[Anti-Crash] Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (err, origin) => {
    logger.error(`[Anti-Crash] Uncaught Exception: ${err}`);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    logger.error(`[Anti-Crash] Exception Monitor: ${err}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.commands = new Collection();
client.manager = new Manager({
    nodes: nodes,
    send: (guild, payload) => client.guilds.cache.get(guild)?.shard?.send(payload),
    shards: client.shard?.count ?? 1,
    autoPlay: true,
    autoResume: true,
    defaultSearchPlatform: "youtube music",
});

const commandPath = path.join(__dirname, "src/commands");
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));
logger.command(`Loading ${commandFiles.length} command(s)...`);
commandFiles.forEach(file => {
    const command = require(`./src/commands/${file}`);
    const commandName = command.data?.name || command.name;
    client.commands.set(commandName, command);
    logger.success(`Loaded command: ${commandName} (${file})`);
});

const eventPath = path.join(__dirname, "src/events");
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".js") && file !== "manager.js");
logger.info(`Loading ${eventFiles.length} Discord event(s)...`);
eventFiles.forEach(file => {
    const event = require(`./src/events/${file}`);
    const eventName = file.split(".")[0];
    client.on(eventName, (...args) => event.execute(client, ...args));
    logger.success(`Loaded Discord event: ${eventName} (${file})`);
});

client.once("clientReady", async () => {
    logger.bot(`Bot is online! Logged in as ${client.user.tag} (${client.user.id})`);
    logger.guild(`Serving ${client.guilds.cache.size} guild(s)`);

    const rest = new REST({ version: "10" }).setToken(token);
    const commandsData = Array.from(client.commands.values()).map(cmd => cmd.data || {
        name: cmd.name,
        description: cmd.description,
        options: cmd.options || [],
    });

    try {
        logger.command(`Registering ${commandsData.length} slash command(s)...`);
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commandsData }
        );
        logger.success("Slash commands registered globally!");
    } catch (error) {
        logger.error("Failed to register slash commands:", error);
    }

    client.manager.init(client.user.id);

    const manager = require("./src/events/manager");
    manager.execute(client);
});

client.login(token);
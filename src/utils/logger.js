const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    light_red: '\x1b[91m',
    light_green: '\x1b[92m',
    light_yellow: '\x1b[93m',
    light_blue: '\x1b[94m',
    light_magenta: '\x1b[95m',
    light_cyan: '\x1b[96m'
};

const getTimestamp = () => {
    const now = new Date();
    return `${colors.gray}[${now.toISOString().replace('T', ' ').substring(0, 19)}]${colors.reset}`;
};

const logger = {
    info: (message) => {
        console.log(`${getTimestamp()} ${colors.cyan}ℹ${colors.reset} ${colors.white}[INFO]${colors.reset} ${colors.bright}${message}${colors.reset}`);
    },
    success: (message) => {
        console.log(`${getTimestamp()} ${colors.green}✓${colors.reset} ${colors.white}[SUCCESS]${colors.reset} ${colors.bright}${message}${colors.reset}`);
    },
    warning: (message) => {
        console.log(`${getTimestamp()} ${colors.yellow}⚠${colors.reset} ${colors.white}[WARNING]${colors.reset} ${colors.bright}${message}${colors.reset}`);
    },
    error: (message) => {
        console.log(`${getTimestamp()} ${colors.light_red}✗${colors.reset} ${colors.white}[ERROR]${colors.reset} ${colors.bright}${message}${colors.reset}`);
    },
    music: (message) => {
        console.log(`${getTimestamp()} ${colors.magenta}♫${colors.reset} ${colors.white}[MUSIC]${colors.reset} ${colors.bright}${message}${colors.reset}`);
    },
    voice: (message) => {
        console.log(`${getTimestamp()} ${colors.blue}🎤${colors.reset} ${colors.white}[VOICE]${colors.reset} ${colors.bright}${message}${colors.reset}`);
    },
    bot: (message) => {
        console.log(`${getTimestamp()} ${colors.light_cyan}🤖${colors.reset} ${colors.white}[BOT]${colors.reset} ${colors.bright}${message}${colors.reset}`);
    },
    command: (message) => {
        console.log(`${getTimestamp()} ${colors.light_green}⌨${colors.reset} ${colors.white}[COMMAND]${colors.reset} ${colors.bright}${message}${colors.reset}`);
    },
    node: (message) => {
        console.log(`${getTimestamp()} ${colors.light_magenta}🔗${colors.reset} ${colors.white}[NODE]${colors.reset} ${colors.bright}${message}${colors.reset}`);
    },
    guild: (message) => {
        console.log(`${getTimestamp()} ${colors.light_yellow}🏠${colors.reset} ${colors.white}[GUILD]${colors.reset} ${colors.bright}${message}${colors.reset}`);
    }
};

module.exports = logger;

const { ShardingManager } = require('discord.js');
const { token } = require('./config.json');

const manager = new ShardingManager('./shard.js', {
    token: token,
    totalShards: 'auto', 
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();
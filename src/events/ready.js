const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log('========================================');
    console.log('  Yomi-S Cultivation Bot is Online!');
    console.log('  Logged in as: ' + client.user.tag);
    console.log('  Servers: ' + client.guilds.cache.size);
    console.log('========================================');

    client.user.setActivity('Cultivation Path', { type: ActivityType.Watching });
  }
};

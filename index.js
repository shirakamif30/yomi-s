/**
 * Yomi-S Cultivation Discord Bot
 * A high-quality leveling system with cultivation-themed roles
 */

const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Create client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember
  ]
});

// Initialize commands collection
client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(function(file) {
  return file.endsWith('.js');
});

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data ? command.data.name : file.replace('.js', ''), command);
  console.log('Loaded command: ' + file);
}

// Load events
const eventsPath = path.join(__dirname, 'src', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(function(file) {
  return file.endsWith('.js');
});

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, function() {
      event.execute.apply(null, Array.prototype.slice.call(arguments));
    });
  } else {
    client.on(event.name, function() {
      event.execute.apply(null, Array.prototype.slice.call(arguments));
    });
  }
  console.log('Loaded event: ' + file);
}

// Error handling
process.on('unhandledRejection', function(error) {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', function(error) {
  console.error('Uncaught exception:', error);
});

// Graceful shutdown
process.on('SIGINT', function() {
  console.log('Shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

// Login
console.log('Starting Yomi-S Cultivation Bot...');
client.login(config.token).catch(function(error) {
  console.error('Failed to login:', error.message);
  console.error('Please check your token in config.json');
  process.exit(1);
});

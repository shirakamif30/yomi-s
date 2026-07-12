/**
 * Deploy slash commands to Discord
 */

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

var commands = [];
var commandsPath = path.join(__dirname, 'commands');
var commandFiles = fs.readdirSync(commandsPath).filter(function(file) {
  return file.endsWith('.js');
});

for (var file of commandFiles) {
  var filePath = path.join(commandsPath, file);
  var command = require(filePath);
  if ('data' in command) {
    commands.push(command.data.toJSON());
  } else if ('' in command) {
    // Skip
  } else {
    console.log('Skipping ' + file + ' (no data export)');
  }
}

var rest = new REST({ version: '10' }).setToken(config.token);

(async function() {
  try {
    console.log('Started refreshing ' + commands.length + ' application (/) commands.');

    var data = await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands }
    );

    console.log('Successfully reloaded ' + data.length + ' application (/) commands.');
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
})();

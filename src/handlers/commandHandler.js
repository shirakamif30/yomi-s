const fs = require('fs');
const path = require('path');

module.exports = function(client) {
  var commandsPath = path.join(__dirname, '..', 'commands');
  var commandFiles = fs.readdirSync(commandsPath).filter(function(file) {
    return file.endsWith('.js');
  });

  for (var file of commandFiles) {
    var filePath = path.join(commandsPath, file);
    var command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else if ('execute' in command) {
      // Handle commands using builder pattern
      console.log('Loaded command: ' + file);
    }
  }
};

const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    var command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error('Unknown command: ' + interaction.commandName);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error('Error executing ' + interaction.commandName + ':', error);
      var reply = { content: 'An error occurred while executing this command.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  }
};

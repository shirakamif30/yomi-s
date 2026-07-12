const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../utils/embeds');
const db = require('../utils/database');

const data = new SlashCommandBuilder()
    .setName('resetlevel')
    .setDescription('Reset a user\'s level and XP')
    .addUserOption(option =>
      option.setName('user').setDescription('User to reset').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    db.resetUser(interaction.guildId, targetUser.id);

    const embed = successEmbed('Level Reset', 'Successfully reset ' + targetUser + '\'s level and XP to 0.');
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };

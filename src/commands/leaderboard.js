const { SlashCommandBuilder } = require('discord.js');
const { leaderboardEmbed } = require('../utils/embeds');
const db = require('../utils/database');

const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the server cultivation leaderboard')
    .addIntegerOption(option =>
      option.setName('page').setDescription('Page number').setRequired(false).setMinValue(1)
    );

async function execute(interaction) {
    const page = interaction.options.getInteger('page') || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const entries = db.getLeaderboard(interaction.guildId, limit + offset).slice(offset, offset + limit);
    const embed = leaderboardEmbed(interaction.guild.name, entries, page);
    await interaction.reply({ embeds: [embed] });
}

module.exports = { data, execute };

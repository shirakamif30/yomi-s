const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { generateRankCard } = require('../utils/cards/rankCard');
const { getLevelFromXp } = require('../utils/xp');
const db = require('../utils/database');

const data = new SlashCommandBuilder()
    .setName('rank')
    .setDescription('View cultivation rank card')
    .addUserOption(option =>
      option.setName('user').setDescription('User to check rank for').setRequired(false)
    );

async function execute(interaction) {
    await interaction.deferReply();

    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const userData = db.getUser(interaction.guildId, targetUser.id);
      const levelData = getLevelFromXp(userData.xp);
      const rank = db.getUserRank(interaction.guildId, targetUser.id);

      const buffer = await generateRankCard({
        username: targetUser.username,
        discriminator: targetUser.discriminator,
        level: levelData.level,
        currentXp: levelData.currentXp,
        requiredXp: levelData.requiredXp,
        rank: rank,
        totalMessages: userData.messages,
        avatarUrl: targetUser.displayAvatarURL({ extension: 'png', size: 256 })
      });

      const attachment = new AttachmentBuilder(buffer, { name: 'rank.png' });
      await interaction.editReply({ files: [attachment] });
    } catch (error) {
      console.error('Rank command error:', error);
      await interaction.editReply('Failed to generate rank card.');
    }
}

module.exports = { data, execute };

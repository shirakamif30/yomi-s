const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../utils/embeds');
const { getLevelFromXp } = require('../utils/xp');
const { getRealmForLevel } = require('../utils/cultivation');
const db = require('../utils/database');

const data = new SlashCommandBuilder()
    .setName('givexp')
    .setDescription('Give XP to a user')
    .addUserOption(option =>
      option.setName('user').setDescription('User to give XP to').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount').setDescription('Amount of XP to give').setRequired(true).setMinValue(1).setMaxValue(100000)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    const userData = db.addXp(interaction.guildId, targetUser.id, amount);
    const levelData = getLevelFromXp(userData.xp);
    const realm = getRealmForLevel(levelData.level);

    const embed = successEmbed(
      'XP Granted',
      'Gave **' + amount + ' XP** to ' + targetUser + '\n\n**New Level:** ' + levelData.level + ' ' + realm.emoji + ' ' + realm.name + '\n**Total XP:** ' + userData.xp.toLocaleString()
    );

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };

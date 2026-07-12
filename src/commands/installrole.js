const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../utils/embeds');
const { getAllRealms } = require('../utils/cultivation');
const db = require('../utils/database');

const data = new SlashCommandBuilder()
    .setName('installrole')
    .setDescription('Install cultivation-themed roles to the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const guild = interaction.guild;
      const realms = getAllRealms();

      const settings = db.getGuildSettings(guild.id);
      if (settings.roles_installed) {
        return interaction.editReply({
          embeds: [errorEmbed('Roles Already Installed', 'Cultivation roles have already been installed.')]
        });
      }

      const createdRoles = [];
      const reversedRealms = realms.slice().reverse();

      for (const realm of reversedRealms) {
        try {
          const role = await guild.roles.create({
            name: realm.emoji + ' ' + realm.name + ' ' + realm.chinese,
            color: realm.color,
            reason: 'Yomi-S Cultivation Role System',
            permissions: []
          });
          createdRoles.push({ role, realm });
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error('Failed to create role for ' + realm.name + ':', error);
        }
      }

      db.setRolesInstalled(guild.id);

      const roleList = createdRoles.map(item => 
        item.realm.emoji + ' ' + item.realm.name + ' ' + item.realm.chinese + ' - Level ' + item.realm.levelReq + '+'
      ).join('\n');

      const embed = successEmbed(
        'Cultivation Roles Installed!',
        'Successfully created **' + createdRoles.length + '** cultivation realms!\n\n' + roleList + '\n\nRoles will be automatically assigned when members level up.'
      );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Install role error:', error);
      await interaction.editReply({
        embeds: [errorEmbed('Installation Failed', 'Failed to install roles. Check permissions.')]
      });
    }
}

module.exports = { data, execute };

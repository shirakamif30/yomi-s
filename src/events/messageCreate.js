const { Events } = require('discord.js');
const { getRandomXp, getLevelFromXp } = require('../utils/xp');
const { getRealmForLevel } = require('../utils/cultivation');
const { levelUpEmbed } = require('../utils/embeds');
const db = require('../utils/database');
const config = require('../../config.json');

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    // Ignore bots and DMs
    if (message.author.bot) return;
    if (!message.guild) return;

    var guildId = message.guild.id;
    var userId = message.author.id;

    // Check cooldown
    var userData = db.getUser(guildId, userId);
    var now = Date.now();
    if (now - userData.last_xp_time < config.leveling.cooldownMs) return;

    // Add random XP
    var xpGain = getRandomXp();
    var updatedUser = db.addXp(guildId, userId, xpGain);

    // Check for level up
    var newLevelData = getLevelFromXp(updatedUser.xp);
    if (newLevelData.level > userData.level) {
      // Update level in database
      db.setLevel(guildId, userId, newLevelData.level);

      var realm = getRealmForLevel(newLevelData.level);

      // Send level-up notification
      var settings = db.getGuildSettings(guildId);
      var channel = null;
      if (settings.level_channel) {
        channel = message.guild.channels.cache.get(settings.level_channel);
      }
      if (!channel) {
        channel = message.channel;
      }

      var embed = levelUpEmbed(message.author.toString(), newLevelData.level, realm);
      channel.send({ embeds: [embed] }).catch(function() {});

      // Auto-assign cultivation role
      try {
        var allRealms = require('../utils/cultivation').getAllRealms();
        var member = message.member;

        // Remove old cultivation roles
        for (var r of allRealms) {
          var existingRole = message.guild.roles.cache.find(function(role) {
            return role.name === r.emoji + ' ' + r.name + ' ' + r.chinese;
          });
          if (existingRole && member.roles.cache.has(existingRole.id)) {
            await member.roles.remove(existingRole).catch(function() {});
          }
        }

        // Add new cultivation role
        var newRole = message.guild.roles.cache.find(function(role) {
          return role.name === realm.emoji + ' ' + realm.name + ' ' + realm.chinese;
        });
        if (newRole) {
          await member.roles.add(newRole).catch(function() {});
        }
      } catch (error) {
        console.error('Role assignment error:', error);
      }
    }
  }
};

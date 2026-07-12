const { EmbedBuilder } = require('discord.js');
const { getRealmForLevel } = require('./cultivation');

function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#86EFAC')
    .setTitle('\u2705 ' + title)
    .setDescription(description)
    .setTimestamp();
}

function errorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#FCA5A5')
    .setTitle('\u274c ' + title)
    .setDescription(description)
    .setTimestamp();
}

function infoEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#7DD3FC')
    .setTitle('\u2139\ufe0f ' + title)
    .setDescription(description)
    .setTimestamp();
}

function levelUpEmbed(user, level, realm) {
  return new EmbedBuilder()
    .setColor(realm.color)
    .setTitle(realm.emoji + ' Cultivation Breakthrough!')
    .setDescription(
      '**' + user + '** has broken through to **Level ' + level + '**!\n\n' +
      '**Realm:** ' + realm.name + ' ' + realm.chinese + '\n' +
      '*' + realm.description + '*'
    )
    .setTimestamp();
}

function leaderboardEmbed(guildName, entries, page) {
  const medals = ['\ud83e\udd47', '\ud83e\udd48', '\ud83e\udd49'];
  
  const description = entries.map(function(entry, index) {
    const rank = (page - 1) * 10 + index + 1;
    const medal = rank <= 3 ? medals[rank - 1] : '**' + rank + '.**';
    const realm = getRealmForLevel(entry.level);
    return medal + ' <@' + entry.user_id + '> \u2014 **Level ' + entry.level + '** ' + realm.emoji + ' ' + realm.name + '\n> XP: ' + formatNumber(entry.xp) + ' | Messages: ' + formatNumber(entry.messages);
  }).join('\n\n');

  return new EmbedBuilder()
    .setColor('#FDE68A')
    .setTitle('\ud83c\udfc6 ' + guildName + ' \u2014 Cultivation Leaderboard')
    .setDescription(description || 'No cultivators found.')
    .setFooter({ text: 'Page ' + page + ' \u2022 Use /leaderboard to navigate' })
    .setTimestamp();
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

module.exports = {
  successEmbed,
  errorEmbed,
  infoEmbed,
  levelUpEmbed,
  leaderboardEmbed
};

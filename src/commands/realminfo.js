const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getAllRealms } = require('../utils/cultivation');

const data = new SlashCommandBuilder()
    .setName('realminfo')
    .setDescription('View all cultivation realms and their requirements')
    .addIntegerOption(option =>
      option.setName('realm').setDescription('Specific realm number (1-10)').setRequired(false).setMinValue(1).setMaxValue(10)
    );

async function execute(interaction) {
    const realmIndex = interaction.options.getInteger('realm');
    const realms = getAllRealms();

    if (realmIndex) {
      const realm = realms[realmIndex - 1];
      const embed = new EmbedBuilder()
        .setColor(realm.color)
        .setTitle(realm.emoji + ' ' + realm.name + ' ' + realm.chinese)
        .setDescription(realm.description)
        .addFields(
          { name: 'Required Level', value: String(realm.levelReq), inline: true },
          { name: 'Realm Number', value: realmIndex + ' / 10', inline: true }
        );
      return interaction.reply({ embeds: [embed] });
    }

    const description = realms.map((realm, index) => 
      '**' + (index + 1) + '.** ' + realm.emoji + ' **' + realm.name + '** ' + realm.chinese + ' - Level ' + realm.levelReq + '+'
    ).join('\n');

    const embed = new EmbedBuilder()
      .setColor('#FDE68A')
      .setTitle('\ud83c\udf0c Cultivation Realms Guide')
      .setDescription(description + '\n\n*Use `/realminfo <number>` for details about a specific realm.*')
      .setFooter({ text: 'Yomi-S Cultivation System' });

    await interaction.reply({ embeds: [embed] });
}

module.exports = { data, execute };

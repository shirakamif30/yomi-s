const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { successEmbed } = require('../utils/embeds');
const db = require('../utils/database');

const data = new SlashCommandBuilder()
    .setName('setlevelchannel')
    .setDescription('Set the channel for level-up notifications')
    .addChannelOption(option =>
      option.setName('channel').setDescription('Channel for level-up messages').addChannelTypes(ChannelType.GuildText).setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

async function execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    db.setLevelChannel(interaction.guildId, channel.id);

    const embed = successEmbed('Level Channel Set', 'Level-up notifications will now be sent to ' + channel);
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };

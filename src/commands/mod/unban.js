const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class UnbanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      usage: 'unban <user ID> [reason]',
      description: 'Unbans a member from your server.',
      type: types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      examples: ['unban 134672335474130944']
    });
  }
  async run(message, args) {
    const id = args[0];
    if (!rgx.test(id)) return this.sendErrorMessage(message, 'Invalid argument. Please  provide a valid user ID.');
    const bannedUsers = await message.guild.fetchBans();
    const user = bannedUsers.get(id);
    if (!user) return this.sendErrorMessage(message, 'Unable to find user. Please check the provided user ID.');
    let reason = args.slice(1).join(' ');
    if(!reason) reason = 'No reason provided';

    await message.guild.unban(user, reason);
    const embed = new MessageEmbed()
      .setTitle('Unban Member')
      .setDescription(`${user.tag} was successfully unbanned.`)
      .addField('Executor', message.member, true)
      .addField('Member', user.tag, true)
      .addField('Reason', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.member.displayName} unbanned ${user.tag}`);
    
    // Update modlog
    this.sendModlogMessage(message, reason, { Member: user.tag });
  }
};

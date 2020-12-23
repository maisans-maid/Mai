const { MessageEmbed } = require('discord.js');
const guilds = require(`${process.cwd()}/models/GuildProfile`);
const consoleUtil = require(`${process.cwd()}/util/console`);

module.exports = (client, guild) => guilds.findById(guild.id, async (err, doc) => {

  const debug = client.channels.cache.get(client.config.channels.debug);

  if (err && debug){
    return debug.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
  } else if (!doc){
    doc = await new guilds({ _id: guild.id }).save();
  };

  client.guildProfiles.set(guild.id, doc);

  if (client.config.channels.logs){
    const channel = client.channels.cache.get(client.config.channels.logs);
    if (!channel){
      return;
    } else {
      channel.send(
        new MessageEmbed()
        .setTimestamp()
        .setColor('GREY')
        .setFooter(`ID: ${guild.id}`)
        .setTitle(`Joined ${guild.name}!`)
        .setThumbnail(guild.iconURL({ format: 'png' }))
        .addFields([
          { name: '❯\u2000\u2000Members', value: guild.memberCount, inline: true },
          { name: '❯\u2000\u2000Owner', value: guild.owner?.user?.tag || 'Uncached', inline: true }
        ])
      );
    };
  };
});

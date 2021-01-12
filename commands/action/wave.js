const { MessageEmbed } = require('discord.js')
const { wave } = require('../../assets/json/images.json')

module.exports = {
    name: 'wave'
  , aliases: []
  , guildOnly: true
  , clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ]
  , group: 'action'
  , description: 'Say hi or goodbye'
  , examples: [
      'wave'
  ]
  , parameters: []
  , run: async ( client, message, args ) => {

    return message.channel.send( new MessageEmbed()
    .setColor('GREY')
    .setDescription(`wave.`)
    .setImage(`client.images.wave())`)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )
  }
}

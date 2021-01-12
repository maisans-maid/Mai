const { MessageEmbed } = require('discord.js')
const { nom } = require('../../assets/json/images.json')

module.exports = {
    name: 'nom'
  , aliases: []
  , guildOnly: true
  , clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ]
  , group: 'action'
  , description: 'nom nom'
  , examples: [
      'nom'
  ]
  , parameters: []
  , run: async ( client, message, args ) => {

    return message.channel.send( new MessageEmbed()
    .setColor('GREY')
    .setDescription(`nom nom`)
    .setImage(`client.images.nom())`)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )
  }
}

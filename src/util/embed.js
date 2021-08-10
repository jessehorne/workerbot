const Discord = require('discord.js');

module.exports = function(title, helps) {
  var message = "";

  helps.forEach(function(h) {
    message = message + h + "\n";
  });

  // Create Embed
  const embed = new Discord.MessageEmbed();
  embed.setColor('#eb4034');
  embed.setTitle(title);

  // embed.setDescription("I'm WorkerBot, the Des Moines IWW's Discord bot. I help with things.");

  embed.addFields(
    { name: 'Commands', value: message}
  );

  // embed.addField('Need more help?', 'Tag somebody.')

  embed.setFooter('');

  return embed;
}

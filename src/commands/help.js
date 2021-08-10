const embed = require("../util/embed");

module.exports = {
  name: '!help',
  description: 'A helpful command.',
  async execute(msg, args) {
    const e = embed("General Help Menu", [
      "!ping : Check if the bot is online.",
      "!help : Get help!"
    ]);

    await msg.channel.send({
      embeds: [e]
    });
    console.log(args);
  }
}

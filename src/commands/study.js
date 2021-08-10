const embed = require("../util/embed");

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './workerbot.sqlite'
});


const Reading = sequelize.define('Reading', {
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

// Reading.sync({ force: true });


module.exports = {
  name: '!study',
  description: 'The study group set of commands.',
  async execute(msg, args) {
    if (args.length == 0) {
      msg.reply("That command is invalid. Try `!study help`");
      return;
    }

    // Get command
    var command = args[0];

    if (command == "help") {
      const e = embed("Study Help Menu", [
        "!study add X : Add X to list of readings and make it the current piece.",
        "!study remove X : Remove X from history.",
        "!study history : List all study group readings history."
      ]);

      await msg.channel.send({
        embeds: [e]
      });

      return;
    } else if (command == "history") {
      Reading.findAll({ order: [['id', 'DESC']]}).then(async readings => {
        if (readings.length == 0) {
          msg.reply("No one has added any readings yet. Try `!study add X`");
        } else {
          var readingList = [];

          readings.forEach(function(r, index) {
            if (index == 0) {
              readingList.push(`${r.id}: \`${r.name}\` (CURRENT)`);
            } else {
              readingList.push(`${r.id}: \`${r.name}\``);
            }
          });

          const e = embed("Reading List", readingList);

          await msg.channel.send({
            embeds: [e]
          });
        }
      });

      return;
    } else if (command == "add") {
      if (args.length <= 1) {
        msg.reply("You need to specify which reading to add...");
        return;
      }

      var readingName = args.slice(1, args.length).join(" ");

      await Reading.create({name: readingName});

      msg.reply("Okay! It's been added to the history and marked as `CURRENT`.");

      return;
    } else if (command == "remove") {
      if (args.length <= 1) {
        msg.reply("You need to specify which reading to remove...");
        return;
      }

      var readingId = args.slice(1, args.length).join(" ");

      var r = await Reading.findByPk(readingId);

      if (!r) {
        msg.reply("There is no reading with an id of `" + readingId + "`.");

        return;
      }

      await Reading.destroy({
        where: {
          id: readingId
        }
      });

      msg.reply("Done.");

      Reading.findAll({ order: [['id', 'DESC']]}).then(async readings => {
        if (readings.length == 0) {
          msg.reply("No one has added any readings yet. Try `!study add X`");
        } else {
          var readingList = [];

          readings.forEach(function(r, index) {
            if (index == 0) {
              readingList.push(`${r.id}: \`${r.name}\` (CURRENT)`);
            } else {
              readingList.push(`${r.id}: \`${r.name}\``);
            }
          });

          const e = embed("Reading List", readingList);

          await msg.channel.send({
            embeds: [e]
          });
        }
      });

      return;
    }
  }
}

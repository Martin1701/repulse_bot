const Discord = require("discord.js");
const { default: Collection } = require("@discordjs/collection");
const fs = require("fs"); // fs module, to interact with file system

module.exports = {
  name: "add_permission",
  description: "adds permissions to send some commands",
  args: 2,
  aliases: ["adp", "add"],
  usage: "[command name, user mention]",
  requirePermission: true,
  requireCreator: true,
  hidden: true,

  execute(message, args) {
    const { commands } = message.client;
    const name = args[0].toLowerCase(); // find iif the command exists (user can also input aliases here)
    let command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));
    if (!command) {
      return message.reply("that's not a valid command!");
    }
    if (command.requirePermission != true) {
      return message.reply("this command doesn't require permissions !"); // if command does not require permission, don't do anything, it's a waste of memory
    }

    if (message.mentions.users.first() != undefined) {
      var id = message.mentions.users.first().id;
    } else {
      return message.channel.send(
        `You need to mention an user, ${message.author}!`
      );
    }
    // read data (same is in ../bot.js)
    let data = fs.readFileSync("permissions.json");
    try {
      var permissions = JSON.parse(data.toString());
    } catch (err) {
      var permissions = {};
    }
    if (permissions[command.name]) {
      // if property exists, append to it
      if (permissions[command.name].includes(id)) {
        return message.reply("this user already has permissions !"); // should return then, we don't need to save, nothing was updated
      }
      permissions[command.name].push(id);
      message.channel.send("permissions added");
    } else {
      // if it does not exist yet, append to it
      permissions[command.name] = [].concat(id); // force to make array (very important)
      message.channel.send("permissions added");
    }

    data = JSON.stringify(permissions);
    // write JSON string to a file
    fs.writeFile("permissions.json", data, (err) => {
      if (err) {
        throw err;
      }
    });
  },
};
// {"notes":[5,4]}

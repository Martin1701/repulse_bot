const Discord = require("discord.js");
const { default: Collection } = require("@discordjs/collection");
const fs = require("fs"); // fs module, to interact with file system
module.exports = {
  name: "remove_permission",
  description: "removes permissions to send some commands",
  args: 2,
  aliases: ["rm", "remove", "rmp"],
  hidden: true,
  requireCreator: true,
  requirePermission: true,
  execute(message, args) {
    const { commands } = message.client;
    const name = args[0].toLowerCase(); // find if the command exists (user can also input aliases here)
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
      // if property read it
      if (permissions[command.name].includes(id)) {
        // if permissions include user we want to remove, remove it
        // console.log(permissions[command.name]);
        permissions[command.name].splice(
          permissions[command.name].indexOf(id),
          1
        );
        message.channel.send("permissions removed");
      } else {
        return message.channel.send("this user doesn't have permissions"); // return without saving, nothing was changed
      }
    } else {
      // if it does not exist yet, append to it
      message.reply("this command doesn't have any permissions set yet");
    }
    if (permissions[command.name]) {
      if (permissions[command.name].length == 0) {
        // if there is property with 0 user id's, remove it to save space
        delete permissions[command.name];
      }
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

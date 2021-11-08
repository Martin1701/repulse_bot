const fs = require("fs");
const { permissions } = require("../bot");
module.exports = {
  name: "add_permission",
  description: "adds permissions to user",
  args: 2,
  aliases: ["adp", "add"],
  usage: "[command name, user mention]",
  requirePermission: true,
  requireCreator: true,
  hidden: true,
  DM: false,
  execute(message, args) {
    if (message.mentions.users.first() != undefined) {
      var id = message.mentions.users.first().id;
    } else {
      return message.channel.send(`You need to mention an user !`);
    }

    const { commands } = message.client;
    const argument = args[0].toLowerCase();
    let commandArr = [];
    commands.map((command) => {
      command.name == argument && commandArr.push(command);
      command.group == argument && commandArr.push(command);
      command.aliases && command.aliases.includes(argument) && commandArr.push(command);
    });
    if (!commandArr.length) {
      return message.channel.send("that's not a valid command / group");
    }
    let added = 0;
    commandArr.forEach((command) => {
      if (command.requirePermission || command.requireCreator) {
        if (permissions[command.name]) {
          if (permissions[command.name].includes(id)) {
            permissions[command.name].push(id);
            added++;
          }
        } else {
          permissions[command.name] = [].concat(id); // force to make array
          added++;
        }
      }
    });
    message.channel.send(`added permissions for \`${added}\` ${added == 1 ? "command" : "commands"}\n`);
    data = JSON.stringify(permissions);
    fs.writeFile("permissions.json", data, (err) => {
      if (err) {
        throw err;
      }
    });
  },
};

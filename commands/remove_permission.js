const fs = require("fs");
const { permissions } = require("../bot");
module.exports = {
  name: "remove_permission",
  description: "removes permissions to send some commands",
  args: 2,
  aliases: ["rm", "remove", "rmp"],
  hidden: true,
  requireCreator: true,
  requirePermission: true,
  DM: false,
  execute(message, args) {
    if (message.mentions.users.first() != undefined) {
      var id = message.mentions.users.first().id;
    } else {
      return message.channel.send(`You need to mention an user !`);
    }
    const { commands } = message.client;
    const argument = args[0].toLowerCase(); // find if the command exists (user can also input aliases here)
    let commandArr = [];
    commands.map((command) => {
      command.name == argument && commandArr.push(command);
      command.group == argument && commandArr.push(command);
      command.aliases && command.aliases.includes(argument) && commandArr.push(command);
    });
    if (!commandArr.length) {
      return message.channel.send("that's not a valid command / group");
    }
    let removed = 0;
    commandArr.forEach((command) => {
      if (permissions[command.name] && permissions[command.name].includes(id)) {
        permissions[command.name].splice(permissions[command.name].indexOf(id), 1);
        removed++;
        permissions[command.name].length == 0 && delete permissions[command.name];
      }
    });
    message.channel.send(`removed permissions for \`${removed}\` ${removed == 1 ? "command" : "commands"}\n`);
    data = JSON.stringify(permissions);
    // write JSON string to a file
    fs.writeFile("permissions.json", data, (err) => {
      if (err) {
        throw err;
      }
    });
  },
};

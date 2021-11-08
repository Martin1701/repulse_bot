const { prefix } = require("../config.json");
module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  aliases: ["commands"],
  usage: ["command name"],
  args: false,
  cooldown: 5,
  DM: true,
  execute(message, args) {
    const data = {};
    const helpMessage = [];
    const { commands } = message.client;
    if (!args.length) {
      helpMessage.push(`**It looks like you need some help!**`);
      helpMessage.push(`Here are all my commands:\n*They're divided into groups now*`);
      commands.map((command) => {
        if (!command.hidden) {
          if (command.group) {
            data[command.group] ? data[command.group].push(command.name) : (data[command.group] = [].concat(command.name));
          } else {
            data["general"] ? data["general"].push(command.name) : (data["general"] = [].concat(command.name));
          }
        }
      });
      for (const prop in data) {
        helpMessage.push(`${prop}: \`${data[prop].join("`, `")}\``);
      }
      helpMessage.push(`\n Do you want info about a specific command? Just send  \`${prefix}help [command name]\``);
      message.channel.send(helpMessage, { split: true });
    } else {
      //* help for individual commands
      const name = args[0].toLowerCase();
      const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));
      if (!command || command.hidden) {
        // help should not work for hidden commands
        return message.reply("that's not a valid command!");
      }
      helpMessage.push(`**Command name:** ${command.name}`);

      if (command.aliases) helpMessage.push(`**Aliases:** ${command.aliases.join(", ")}`);
      if (command.description) helpMessage.push(`**Description:** ${command.description}`);
      if (command.usage)
        helpMessage.push(`**Usage:** \`${prefix}${command.name} ${command.usage.join(`\`, \`${prefix}${command.name} `)}\``);
      // TODO add later
      typeof command.args == "number"
        ? helpMessage.push(`**arguments:** ${command.args}`)
        : helpMessage.push(command.args ? "arguments: Yes" : "arguments: No");

      if (typeof command.requirePermission == "boolean")
        helpMessage.push(`**Require Permission:** ${command.requirePermission ? "Yes" : "No"}`);
      helpMessage.push(`**Cooldown:** ${command.cooldown || 3} seconds`);
      message.channel.send(helpMessage, { split: true });
    }
  },
};

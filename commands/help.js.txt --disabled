const { default: Collection } = require("@discordjs/collection");
const { prefix } = require("../config.json");
module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  aliases: ["commands"],
  usage: ["[command name]"],
  args: true, //- NO, (if you don't set arguments, bot will ignore number of arguments)
  cooldown: 5,
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push("Here's a list of all my commands:");
      let commandArr = commands.map((command) =>
        command.hidden == true ? null : command.name
      );
      commandArr = commandArr.filter((a) => a); // remove blank elements
      data.push(commandArr.join(", "));
      // data.push(commands.map((command) => command.name).join(", ")); backup
      data.push(
        `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
      );

      message.reply(data, { split: true });
      // this part will send DM to user, I don't want that, but I will still leave it here for future use
      //
      // return message.author.send(data, { split: true })
      // .then(() => {
      //   if (message.channel.type === "dm") return;
      //   message.reply("I've sent you a DM with all my commands!");
      // })
      // .catch((error) => {
      //   console.error(
      //     `Could not send help DM to ${message.author.tag}.\n`,
      //     error
      //   );
      //   message.reply(
      //     "it seems like I can't DM you! Do you have DMs disabled?"
      //   );
      // });
      //* help for individual commands
    } else {
      const name = args[0].toLowerCase();
      const command =
        commands.get(name) ||
        commands.find((c) => c.aliases && c.aliases.includes(name));
      if (!command || command.hidden) {
        // help should not work for hidden commands
        return message.reply("that's not a valid command!");
      }
      data.push(`**Name:** ${command.name}`);

      if (command.aliases)
        data.push(`**Aliases:** ${command.aliases.join(", ")}`);
      if (command.description)
        data.push(`**Description:** ${command.description}`);
      if (command.usage) {
        data.push(`**Usage:**\n       ${command.usage.join("\n      ")}`);
      }
      // since permissions are disabled for now
      /*
      if (typeof command.requirePermission == "boolean")
        data.push(
          `**Require Permission:** ${command.requirePermission ? "YES" : "NO"}`
        );
      */
      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
      message.channel.send(data, { split: true });
    }
  },
};

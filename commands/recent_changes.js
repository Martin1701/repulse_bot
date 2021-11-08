module.exports = {
  name: "recent_changes",
  description: "sends list of recent changes",
  aliases: ["changes", "news"],
  args: 0,
  requirePermission: false,
  DM: true,
  execute(message, args) {
    // important note
    // this command is managed like this, updated every time code is committed
    message.channel.send(
      `**recent changes**\n
      updated: nov. 11. 2021\n
      \`- some commands will not work in DMs now\`\n
      \`- you don't need to use prefix in DMs\`\n
      \`- commands are divided into groups\``
    );
  },
};

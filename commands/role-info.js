module.exports = {
  name: "role-info",
  description: "Information about author's roles",
  args: false,
  aliases: ["role"],
  requirePermission: false,
  execute(message, args) {
    if (message.guild === null) {
      return message.reply("You are in a DM, there aren't any roles");
    }
    if (message.member.roles) {
      let roleArr = [];
      message.member.roles.forEach((element) => {
        roleArr.push(element.name);
      });
      roleArr.splice(roleArr.indexOf("@everyone"), 1);
      return message.channel.send("Your roles: " + roleArr.join(", "));
    } else {
      return message.channel.send("You don't have any roles");
    }
  },
};

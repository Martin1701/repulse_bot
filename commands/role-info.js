module.exports = {
  name: "role-info",
  description: "Information about author's roles",
  args: false,
  requirePermission: false,
  //711899225809616956,805910023422476329,765537398234677311
  execute(message, args) {
    // let allowedRole = message.guild.roles.find("name", "Admin");
    // let roles = [allowedRole.id];
    // allowedRole = message.guild.roles.find("name", "TETA CHRUM CHRUM");
    // roles.push(allowedRole.id);
    // allowedRole = message.guild.roles.find("name", "admin2");
    // roles.push(allowedRole.id);
    // // if (message.guild.roles) {
    // //   message.channel.send(roles);
    // // }
    if (message.member.roles) {
      let roleArr = [];
      message.member.roles.forEach((element) => {
        roleArr.push(element.name);
      });
      return message.channel.send("Your roles: " + roleArr.join(", "));
    } else {
      return message.channel.send("You don't have any roles");
    }
  },
};

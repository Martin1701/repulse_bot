const Discord = require("discord.js");
const { type } = require("os");
// import { client } from "../bot";
const { client } = require("../bot");
module.exports = {
  name: "activity",
  description: "sets bot activity",
  aliases: ["setActivity"],
  args: true,
  requirePermission: true,
  hidden: true,
  execute(message, args) {
    //! TODO this
    if (args[0] == "remove") {
      client.user.setActivity("");
      return message.channel.send("Activity removed");
    } else {
      client.user
        .setActivity(args.join(" "), { type: "PLAYING" })
        .then((presence) =>
          message.channel.send(
            `Activity set to ${presence.game ? presence.game.name : "none"}`
          )
        );
    }
  },
};

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
  requireCreator: true,
  hidden: true,
  execute(message, args) {
    //! TODO this
    if (args[0] == "remove") {
      client.user.setActivity("");
      return message.channel.send("Activity removed");
    }
    const activityName = args.splice(1).join(" ");
    switch (args[0].toUpperCase()) {
      case "PLAYING": {
        client.user
          .setActivity(activityName, { type: "PLAYING" })
          .then((presence) =>
            message.channel.send(
              `Activity set to ${presence.game ? presence.game.name : "none"}`
            )
          );
        return;
      }
      case "STREAMING": {
        client.user
          .setActivity(activityName, { type: "STREAMING" })
          .then((presence) =>
            message.channel.send(
              `Activity set to ${presence.game ? presence.game.name : "none"}`
            )
          );
        return;
      }
      case "LISTENING": {
        client.user
          .setActivity(activityName, { type: "LISTENING" })
          .then((presence) =>
            message.channel.send(
              `Activity set to ${presence.game ? presence.game.name : "none"}`
            )
          );
        return;
      }
      case "WATCHING": {
        client.user
          .setActivity(activityName, { type: "WATCHING" })
          .then((presence) =>
            message.channel.send(
              `Activity set to ${presence.game ? presence.game.name : "none"}`
            )
          );
        return;
      }
      default: {
        client.user
          .setActivity(args.join(" "), { type: "PLAYING" })
          .then((presence) =>
            message.channel.send(
              `Activity set to ${presence.game ? presence.game.name : "none"}`
            )
          );
        return;
      }
    }
  },
};

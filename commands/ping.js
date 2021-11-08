const { client } = require("../bot");
module.exports = {
  name: "ping",
  description: "Calculates ping from user to bot",
  cooldown: 5,
  DM: true,
  execute(message, args) {
    message.channel.send("Calculating ping...").then((resultMessage) => {
      const ping = resultMessage.createdTimestamp - message.createdTimestamp;
      resultMessage.edit(`Bot latency: **${Date.now() - message.createdTimestamp}**ms\nAPI latency: **${client.ping}**ms`);
    });
    return;
    message.channel.send("Pong.");
  },
};

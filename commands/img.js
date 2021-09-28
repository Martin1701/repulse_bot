const Discord = require("discord.js");
module.exports = {
  name: "image",
  description: "sends image",
  args: 0,
  execute(message, args) {
    const exampleEmbed = new Discord.MessageEmbed().setImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/A._gigantea_Aldabra_Giant_Tortoise.jpg/1200px-A._gigantea_Aldabra_Giant_Tortoise.jpg"
    );
    return message.channel.send(exampleEmbed);
  },
};

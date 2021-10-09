const { RichEmbed } = require("discord.js");
const { client } = require("../bot");
module.exports = {
  name: "embed",
  description: "embed test",
  aliases: [],
  args: 0, // set to true to ignore argument count
  usage: ["commandUsage"],
  execute(message, args) {
    const embed = new RichEmbed()
      .setTitle("No song playing currently")
      .setImage(
        "https://upload.wikimedia.org/wikipedia/commons/7/77/Renown-7.jpg"
      )
      .setColor("507aa8");
    const playlist = message.channel.send(
      `Queue list: \nJoin a voice channel and queue songs by name or url in here.${embed}`
    );
    playlist.then((playlist) => {
      playlist.react("⏯️");
      playlist.react("⏹️");
      playlist.react("⏭️");
      playlist.react("❌");
    });
    return;
  },
};

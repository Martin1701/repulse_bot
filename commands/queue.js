const { queue } = require("../bot");
module.exports = {
  name: "queue",
  description: "Displays song queue",
  aliases: ["q"],
  args: 0,
  group: "music",
  DM: false,
  execute(message, args) {
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue) {
      return message.channel.send("There's no music playing right now");
    }
    const songQueue = [];
    songQueue.push(
      serverQueue.songs
        .map((song, index) => (index == 0 ? `${index + 1}: \`${song.title}\` - now playing` : `${index + 1}: \`${song.title}\``))
        .join("\n")
    );
    message.channel.send("song queue:\n" + songQueue);
  },
};

const { queue } = require("../bot");
module.exports = {
  name: "queue",
  description: "prints song queue",
  aliases: [],
  args: 0,
  usage: ["commandUsage"],
  execute(message, args) {
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue) {
      return message.channel.send("There's no music playing right now");
    }
    const songQueue = [];
    songQueue.push(
      serverQueue.songs
        .map((song, index) => `${index + 1}: \`${song.title}\``)
        .join("\n")
    );
    message.channel.send("song queue:\n" + songQueue);
  },
};

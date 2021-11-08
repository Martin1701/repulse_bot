const { queue } = require("../bot");
module.exports = {
  name: "stop",
  description: "stops playing",
  args: 0, // set to true to ignore argument count
  aliases: ["s"],
  requirePermission: true,
  group: "music",
  DM: false,
  execute(message, args) {
    const serverQueue = queue.get(message.guild.id);
    if (serverQueue) {
      if (message.member.voiceChannel == serverQueue.voiceChannel) {
        serverQueue.songs = [];
        serverQueue.broadcast.destroy();
      }
    } else {
      message.channel.send("I'm not in a voice channel right now");
    }
  },
};

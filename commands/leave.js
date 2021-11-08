const { queue } = require("../bot");
module.exports = {
  name: "leave",
  description: "leaves channel",
  args: 0,
  aliases: ["l"],
  requirePermission: true,
  group: "music",
  DM: false,
  execute(message, args) {
    const serverQueue = queue.get(message.guild.id);
    if (serverQueue) {
      if (message.member.voiceChannel == serverQueue.voiceChannel) {
        serverQueue.songs = [];
        serverQueue.broadcast.destroy();
        serverQueue.voiceChannel.leave();
        queue.delete(message.guild.id);
        message.channel.send("Bye Bye !");
      }
    } else {
      message.channel.send("I'm not in a voice channel right now");
    }
  },
};

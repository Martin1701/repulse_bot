const { queue } = require("../bot");
module.exports = {
  name: "skip",
  description: "skips song",
  args: 0,
  requirePermission: true,
  group: "music",
  DM: false,
  execute(message, args) {
    const serverQueue = queue.get(message.guild.id);
    serverQueue.broadcast.end();
  },
};

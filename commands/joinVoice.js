const ytdl = require("ytdl-core");
const streamOptions = { seek: 0, volume: 1 };
const { client } = require("../bot");
const broadcast = client.createVoiceBroadcast();
module.exports = {
  name: "joinVC",
  description: "joins voice channel message author is in",
  aliases: ["join", "VC"],
  args: 0, // set to true to ignore argument count
  // usage: ["commandUsage"],
  execute(message, args) {
    const { voiceChannel } = message.member;

    if (!voiceChannel) {
      return message.reply("please join a voice channel first!");
    }
    // voiceChannel.join();

    voiceChannel
      .join()
      .then((connection) => {
        const stream = ytdl("https://youtu.be/LQMq4YEMvH8", {
          filter: "audioonly",
        });
        broadcast.playStream(stream);
        const dispatcher = connection.playBroadcast(broadcast);
      })
      .catch(console.error);
  },
};

const Discord = require("discord.js");
const bot = new Discord.Client();
const queue = new Map();
const prefix = "?"; // this prefix is in Question.

bot.on("message", async (message) => {
  // if direct-message received, message.guild could be null
  // Not handle that case.
  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}audio`)) {
    execute(message, serverQueue);
  }
});

// I assume user message is "?audio audioName"
function execute(message, serverQueue) {
  const audioName = message.content.split(" ")[1]; // "audioName"

  // check user who send message is in voiceChannel
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    return message.channel.send("YOU ARE NOT IN VOICE CHANNEL");
  }

  // check permission
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("PERMISSION ERROR");
  }

  /*
    I handle only songs with google youtube api
    So, I skip how to get & push song information
  */

  if (!serverQueue) {
    // create new serverQueue

    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      search: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);

    // "song" value is one of play list in my case
    // var song = {title: 'audioName', url: 'youtube-url'};
    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      playStart(message.guild, queueContruct.songs[0]);
    } catch (err) {
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    // exist serverQueue
    // "song" value is one of play list in my case
    // var song = {title: 'audioName', url: 'youtube-url'};
    serverQueue.songs.push(song);

    if (serverQueue.songs.length == 1) {
      playStart(message.guild, serverQueue.songs[0]);
    }
  }
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    if (serverQueue.songs.length == 0) {
      serverQueue.leaveTimer = setTimeout(function () {
        leave_with_timeout(guild.id);
      }, 20 * 1000); // 20 seconds is for follow question
    }
    return;
  }

  // clear timer before set
  try {
    clearTimeout(serverQueue.leaveTimer);
  } catch (e) {
    // there's no leaveTimer
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift(); // pop front
      play(guild, serverQueue.songs[0]); // play next
    })
    .on("error", (error) => console.log(error));
  dispatcher.setVolumeLogarithmic(1);
  serverQueue.textChannel.send(`Play Start ${song.title}`);
}

function leave_with_timeout(guild_id) {
  const serverQueue = queue.get(guild_id);
  if (serverQueue) {
    serverQueue.textChannel.send(`20 seconds left. Bye!`);
    serverQueue.voiceChannel.leave();
    queue.delete(guild_id);
  }
}

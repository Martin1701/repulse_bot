const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const { client, queue } = require("../bot");
var getYoutubeTitle = require("get-youtube-title");
module.exports = {
  name: "play",
  description: "plays song",
  aliases: [""],
  args: true, // set to true to ignore argument count
  usage: ["[youtube url]", "[song name]"],
  requirePermission: true,
  aliases: ["s"],
  group: "music",
  DM: false,
  execute(message, args) {
    const serverQueue = queue.get(message.guild.id);

    const voiceChannel = message.member.voiceChannel; // get message creator voice channel
    if (!voiceChannel) {
      // check if he is in VC
      return message.channel.send("please join a voice channel first!");
    }
    // check permission for bot
    const permissions = voiceChannel.permissionsFor(client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send("sorry, I don't have permissions for this channel");
    }

    if (!serverQueue) {
      // create new serverQueue
      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        broadcast: null,
        songs: [],
        /*search: [],
        volume: 5,
        playing: true, not used at all */
      };
      queue.set(message.guild.id, queueConstruct);

      getSong(args, function (song) {
        queueConstruct.songs.push(song);
        try {
          voiceChannel.join().then((connection) => {
            //! play song
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
          });
        } catch (err) {
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      });
    } else {
      if (message.member.voiceChannel == serverQueue.voiceChannel) {
        // message author voice channel and bt voice channel must be the same
        if (message.channel != serverQueue.textChannel) {
          // if user used another text channel, use that channel for messages from now on
          serverQueue.textChannel = message.channel;
        }
        getSong(args, function (song) {
          serverQueue.songs.push(song);
          serverQueue.textChannel.send(`\`${song.title}\` was added to queue`);
          if (serverQueue.songs.length == 1) {
            play(message.guild, serverQueue.songs[0]);
          }
        });
      }
    }
  },
};
//! play function
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

  const stream = ytdl(song.url, {
    filter: "audioonly",
  });
  const broadcast = client.createVoiceBroadcast();
  serverQueue.broadcast = broadcast;
  broadcast.playStream(stream).on("end", () => {
    serverQueue.songs.shift(); // pop front //1
    play(guild, serverQueue.songs[0]); // play next
  });
  const dispatcher = serverQueue.connection.playBroadcast(broadcast);

  dispatcher.setVolumeLogarithmic(1);
  serverQueue.textChannel.send(`Started playing:  \`${song.title}\``);
}

function leave_with_timeout(guild_id) {
  const serverQueue = queue.get(guild_id);
  if (serverQueue) {
    serverQueue.textChannel.send(`20 seconds left. Bye!`);
    serverQueue.voiceChannel.leave();
    queue.delete(guild_id);
  }
}
// when someone disconnects the bot, delete serverQueue
client.on("voiceStateUpdate", function (oldMember, newMember) {
  const guildID = oldMember.guild.id;
  const serverQueue = queue.get(guildID);
  if (
    /*newMember.voiceChannelID === null && */ client.user.id == oldMember.id &&
    oldMember.voiceChannelID != undefined &&
    oldMember.voiceChannelID != newMember.voiceChannelID
  ) {
    // if user disconnected and the user is bot, delete music log, since music is no longer playing
    //* do this even when the bot was moved (for now)
    if (serverQueue) {
      serverQueue.textChannel.send(`I was disconnected from channel. Bye!`);
      queue.delete(guildID);
    }
  }
});
function getSong(args, callback) {
  // check if argument is video url or name
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
  var match = args[0].match(regExp);
  if (match && match[2].length == 11) {
    // if argument is youtube video url
    getYoutubeTitle(match[2], function (err, videoTitle) {
      const song = { title: videoTitle, url: args[0] };
      callback(song);
    });
  } else {
    // argument is just name, search for it
    ytsr(args.join(" "), (options = { limit: 2, pages: 1 })).then((resp) => {
      const videoUrl = resp.items[0].url;
      match = videoUrl.match(regExp);
      getYoutubeTitle(match[2], function (err, videoTitle) {
        const song = { title: videoTitle, url: videoUrl };
        callback(song);
      });
    });
  }
}

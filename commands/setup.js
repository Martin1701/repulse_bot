const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const { client } = require("../bot");
const { send } = require("process");
module.exports = {
  name: "setup",
  description: "set up music channel",
  aliases: [],
  args: 0, // set to true to ignore argument count
  usage: [],
  execute(message, args) {
    // read data from file
    let data = fs.readFileSync("channelDs.json");
    try {
      var channels = JSON.parse(data.toString());
    } catch (err) {
      var channels = {};
    }
    message.delete();
    //send message to channel we want to set up as music channel
    const channel = client.channels.get(args[0]);
    const sendMessage = channel.send("hello !");
    console.log(sendMessage);

    sendMessage.then((sendMessage) => sendMessage.edit("message edited"));
    return;
    const guildID = message.guild.id;
    channels[guildID].channelID = args[0];

    // const guildID = message.guild.id;
    if (channels[guildID]) {
      const channel = client.channels.get(channels[guildID]);
      channel.send("hello !");
    } else {
      message.reply("you don't have music channel set up");
    }

    //

    //

    //

    data = JSON.stringify(channels);
    // write JSON string to a file
    fs.writeFile("channelDs.json", data, (err) => {
      if (err) {
        throw err;
      }
    });
    message.channel.send("sucess");
  },
};

const ytsr = require("ytsr");
module.exports = {
  name: "findVideo",
  description: "finds youtube video by it's name",
  aliases: ["find", "youtube"],
  args: true, // set to true to ignore argument count
  usage: ["video name"],
  execute(message, args) {
    const search = args.join(" ");
    ytsr(search, (options = { limit: 2, pages: 1 })).then((resp) =>
      message.channel.send(resp.items[0].url)
    );
  },
};

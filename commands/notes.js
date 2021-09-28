const Discord = require("discord.js");
module.exports = {
  name: "notes",
  description: "poznámky z predmetu Elektrotechnické merania",
  aliases: ["poznamky"],
  args: 1,
  usage: "[subject name]",
  requirePermission: true,
  execute(message, args) {
    // will add more subjects, etc...
    if (args[0].toUpperCase() == "ELM") {
      //* elektrotechnické merania
      return message.reply("Elektrotechnické merania.", {
        files: ["./files/2_MMS.pdf"],
      });
    }
  },
};

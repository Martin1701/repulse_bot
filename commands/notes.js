const Discord = require("discord.js");
const { creatorID } = require("../config.json");
const https = require("https");
let fs = require("fs");
const supportedFileTypes = [".png", ".jpg", ".pdf", ".docx", ".pptx", ".txt"];
module.exports = {
  name: "notes",
  description: "poznámky z predmetu Elektrotechnické merania",
  aliases: ["poznamky"],
  args: 1,
  usage: "[subject name]",
  requirePermission: false,
  execute(message, args) {
    const subjectName = args[0].toUpperCase();
    let data = fs.readFileSync("notes.json");
    try {
      var subjects = JSON.parse(data.toString());
    } catch (err) {
      var subjects = {};
    }
    //! for now only creator can upload files
    if (message.author.id == creatorID[0]) {
      //creatorID[0])
      if (message.attachments.first()) {
        const nameOfFile = message.attachments.first().filename;
        if (
          supportedFileTypes.includes(nameOfFile.slice(nameOfFile.indexOf(".")))
        ) {
          // message.channel.send("file type supported");
        } else {
          return message.channel.send(
            `I'm sorry this file type is not supported`
          );
        }
        const file = fs.createWriteStream(`./files/${nameOfFile}`);
        const request = https.get(
          message.attachments.first().url,
          function (response) {
            response.pipe(file);
          }
        );
        if (subjects[subjectName]) {
          // check if subjects, we want to save data as exists
          subjects[subjectName] = nameOfFile; // save file name into subject (this way we can find them later and keep their original name)
        } else {
          subjects[subjectName] = [].concat(nameOfFile);
        }
        // save data back to file
        data = JSON.stringify(subjects);
        // write JSON string to a file
        fs.writeFile("notes.json", data, (err) => {
          if (err) {
            throw err;
          }
        });
        // then return
        return message.channel.send(
          `file ${nameOfFile} successfully uploaded to ${subjectName} subject`
        );
      }
    }
    if (Object.getOwnPropertyNames(subjects).includes(subjectName)) {
      return message.reply(subjectName + ":", {
        files: [`./files/${subjects[subjectName]}`],
      });
    } else {
      return message.reply("Sorry, I don't have any file for this subject");
    }
  },
};

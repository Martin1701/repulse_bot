const Discord = require("discord.js");
const { creatorID } = require("../config.json");
const https = require("https");
let fs = require("fs");
const supportedFileTypes = [".png", ".jpg", ".pdf", ".docx", ".pptx", ".txt"];
module.exports = {
  name: "files",
  description: "command to save some files",
  aliases: ["file"],
  args: 1,
  usage: [
    "[alias]  => get file by name",
    "list  => list all files and their aliases",
    "[alias] + file  => save file under this subject",
    "remove => remove file (write alias later)",
  ],
  requirePermission: false,
  execute(message, args) {
    const fileName = args[0].toUpperCase();
    let data = fs.readFileSync("files/filesInfo.json");
    try {
      var files = JSON.parse(data.toString());
    } catch (err) {
      var files = {};
    }
    if (args[0].toLowerCase() == "list") {
      let fileArr = [];
      for (const key in files) {
        if (files[key] != "") {
          fileArr.push(`${key}: ${files[key]}`);
        }
      }
      return message.reply(
        `here's a list of all files: \n ${fileArr.join("\n")}`
      );
    }
    if (args[0].toLowerCase() == "remove") {
      let filter = (m) => m.author.id === message.author.id;
      message.channel.send("file alias: ").then(() => {
        message.channel
          .awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ["time"],
          })
          .then((message) => {
            message = message.first();
            if (message.content) {
              // add .toUppercase if checking for words
              // remove the file first
              if (files[message.content.toUpperCase()]) {
                fs.unlinkSync(
                  `./files/${files[message.content.toUpperCase()]}`
                );
              }
              delete files[message.content.toUpperCase()]; // delete file path and alias
              // save data back to file
              data = JSON.stringify(files);
              // write JSON string to a file
              fs.writeFile("./files/filesInfo.json", data, (err) => {
                if (err) {
                  throw err;
                }
              });
              return message.channel.send("path successfully removed");
            } else {
              return message.channel.send("Terminated");
            }
          })
          .catch((collected) => {
            return message.channel.send("Timed out");
          });
      });
    } else {
      //! here, everyone can upload files
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
        if (files[fileName] != "") {
          fs.unlinkSync(`./files/${files[fileName]}`); // remove old file before downloading new one
        }
        const file = fs.createWriteStream(`./files/${nameOfFile}`);
        const request = https.get(
          message.attachments.first().url,
          function (response) {
            response.pipe(file);
          }
        );
        if (files[fileName]) {
          // check if files, we want to save data as exists
          files[fileName] = nameOfFile; // save file name into subject (this way we can find them later and keep their original name)
        } else {
          files[fileName] = [].concat(nameOfFile); // this should not happen (files are predefined)
        }
        // save data back to file
        data = JSON.stringify(files);
        // write JSON string to a file
        fs.writeFile("./files/filesInfo.json", data, (err) => {
          if (err) {
            throw err;
          }
        });
        // then return
        return message.channel.send(
          `file: ${nameOfFile} successfully uploaded as ${fileName}`
        );
      }
      if (files[fileName]) {
        // get file
        return message.reply(fileName + ":", {
          files: [`files/${files[fileName]}`],
        });
      } else {
        return message.reply("Sorry, I don't have any file for this subject");
      }
    }
  },
};

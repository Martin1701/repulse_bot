const Discord = require("discord.js");
const { creatorID } = require("../config.json");
const https = require("https");
let fs = require("fs");
const supportedFileTypes = [".png", ".jpg", ".pdf", ".docx", ".pptx", ".txt"];
module.exports = {
  name: "notes",
  description: "notes for subjects",
  aliases: ["poznamky"],
  args: 1,
  usage: [
    "[subject]  => get file for that subject ",
    "files  => list all subjects with files",
    "subjects  => list all available subjects",
    "[subject] + file  => save file under this subject",
  ],
  requirePermission: true,
  execute(message, args) {
    const subjectName = args[0].toUpperCase();
    let data = fs.readFileSync("./notes/notes.json");
    try {
      var subjects = JSON.parse(data.toString());
    } catch (err) {
      var subjects = {};
    }
    if (args[0].toLowerCase() == "files") {
      // list all subjects with their files
      let subjectArr = [];
      for (const key in subjects) {
        if (subjects[key] != "") {
          subjectArr.push(`${key}: ${subjects[key]}`);
        }
      }
      return message.reply(
        `here's a list of all subjects and their files:\n${subjectArr.join(
          "\n"
        )}`
      );
    }
    if (args[0].toLowerCase() == "subjects") {
      // list all subjects with their files
      let subjectArr = [];
      for (const key in subjects) {
        if (subjects[key] != "") {
          subjectArr.push(`${key}: ${subjects[key]}`);
        }
      }
      return message.reply(
        `here's a list of all subjects: \n ${Object.keys(subjects).join(", ")}`
      );
    }
    if (
      args[0].toLowerCase() == "remove" &&
      message.author.id == creatorID[0]
    ) {
      let filter = (m) => m.author.id === message.author.id;
      message.channel.send("subject name: ").then(() => {
        message.channel
          .awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ["time"],
          })
          .then((message) => {
            message = message.first();
            // proceed only if file we want to remove exists, it's name is saved under the subject
            if (subjects[message.content.toUpperCase()] != "") {
              // remove file
              fs.unlinkSync(`notes/${subjects[message.content.toUpperCase()]}`);

              subjects[message.content.toUpperCase()] = ""; // delete file path
              // save data back to file
              data = JSON.stringify(subjects);
              // write JSON string to a file
              fs.writeFile("./notes/notes.json", data, (err) => {
                if (err) {
                  throw err;
                }
              });
              return message.channel.send("file successfully removed");
            } else {
              return message.reply("there isn't any file for this subject");
            }
          })
          .catch((collected) => {
            return message.channel.send("Timed out");
          });
      });
    } else {
      //! only creator can upload files (yes, only me)
      if (message.author.id == creatorID[0]) {
        if (message.attachments.first()) {
          const nameOfFile = message.attachments.first().filename;
          if (
            supportedFileTypes.includes(
              nameOfFile.slice(nameOfFile.indexOf("."))
            )
          ) {
            // message.channel.send("file type supported");
          } else {
            return message.channel.send(
              `I'm sorry this file type is not supported`
            );
          }
          if (subjects[subjectName] != "") {
            fs.unlinkSync(`./notes/${subjects[subjectName]}`); // remove old file before downloading new one (if there is any)
          }
          const file = fs.createWriteStream(`./notes/${nameOfFile}`);
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
            subjects[subjectName] = [].concat(nameOfFile); // this should not happen (subjects are predefined)
          }
          // save data back to file
          data = JSON.stringify(subjects);
          // write JSON string to a file
          fs.writeFile("./notes/notes.json", data, (err) => {
            if (err) {
              throw err;
            }
          });
          // then return
          return message.channel.send(
            `file: ${nameOfFile} successfully uploaded to ${subjectName} subject`
          );
        }
      }
      if (subjects[subjectName]) {
        //! important, files will be sent to dm from now on, it's way more secure and files will get only to the users with permissions who will value our service
        // since now all subjects are declared we just need to check if subject has some file property
        // send file to channel (old)
        // return message.reply(subjectName + ":", {
        //   files: [`./notes/${subjects[subjectName]}`],
        // });
        return message.author
          .send(
            `here is your file for: ${subjectName}\n\`please don't share !\` (you don't want to be hurt by my 15 in guns)\nenjoy :smile:`,
            {
              files: [`./notes/${subjects[subjectName]}`],
            },
            { split: true }
          )
          .then(() => {
            if (message.channel.type === "dm") return;
            message.reply("I've sent you a DM");
          })
          .catch((error) => {
            console.error(
              `Could not send help DM to ${message.author.tag}.\n`,
              error
            );
            message.reply(
              "it seems like I can't DM you! Do you have DMs disabled?"
            );
          });
      } else {
        return message.reply("Sorry, I don't have any file for this subject");
      }
    }
  },
};

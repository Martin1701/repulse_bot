const { creatorID } = require("../config.json");
const https = require("https");
let fs = require("fs");
const supportedFileTypes = [".png", ".jpg", ".pdf", ".docx", ".pptx", ".txt"];
module.exports = {
  name: "notes",
  description: "notes for subjects",
  aliases: ["poznamky"],
  args: 1,
  usage: ["[subject]", "list", "subjects"],
  requirePermission: true,
  group: "school",
  DM: true,
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
      return message.channel.send(`here's a list of all subjects and their files:\n\`${subjectArr.join("\n")}\``);
    }
    if (args[0].toLowerCase() == "subjects") {
      // list all subjects with their files
      let subjectArr = [];
      for (const key in subjects) {
        if (subjects[key] != "") {
          subjectArr.push(`${key}: ${subjects[key]}`);
        }
      }
      return message.channel.send(`here's a list of all subjects: \n\`${Object.keys(subjects).join(", ")}\``);
    }
    if (args[0].toLowerCase() == "remove" && message.author.id == creatorID[0]) {
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
              data = JSON.stringify(subjects);
              fs.writeFile("./notes/notes.json", data, (err) => {
                if (err) {
                  throw err;
                }
              });
              return message.channel.send("file successfully removed");
            } else {
              return message.channel.send("there isn't any file for this subject");
            }
          })
          .catch((collected) => {
            return message.channel.send("Timed out");
          });
      });
    } else {
      //! only creator can upload files
      if (message.author.id == creatorID[0]) {
        if (message.attachments.first()) {
          const nameOfFile = message.attachments.first().filename;
          if (!supportedFileTypes.includes(nameOfFile.slice(nameOfFile.indexOf("."))))
            return message.channel.send(`I'm sorry, this file type is not supported`);

          if (subjects[subjectName] != "") {
            fs.unlinkSync(`./notes/${subjects[subjectName]}`); // remove old file before downloading new one (if there is any)
          }
          const file = fs.createWriteStream(`./notes/${nameOfFile}`);
          const request = https.get(message.attachments.first().url, function (response) {
            response.pipe(file);
          });
          if (subjects[subjectName]) {
            // check if subjects, we want to save data as exists
            subjects[subjectName] = nameOfFile; // save file name into subject (this way we can find them later and keep their original name)
          } else {
            subjects[subjectName] = [].concat(nameOfFile);
          }
          data = JSON.stringify(subjects);
          fs.writeFile("./notes/notes.json", data, (err) => {
            if (err) {
              throw err;
            }
          });
          return message.channel.send(`file: \`${nameOfFile}\` successfully uploaded to \`${subjectName}\` subject`);
        }
      }
      if (subjects[subjectName]) {
        return message.author
          .send(
            `here is your file for: ${subjectName}\n\`please don't share !\` (you don't want to get hurt by my 15 in guns)\nenjoy :smile:`,
            {
              files: [`./notes/${subjects[subjectName]}`],
            },
            { split: true }
          )
          .then(() => {
            if (message.channel.type === "dm") return;
            message.channel.send("I've sent you a DM");
          })
          .catch(() => {
            message.reply("it seems like I can't DM you! Do you have DMs disabled?");
          });
      } else {
        return message.channel.send("Sorry, I don't have any file for this subject");
      }
    }
  },
};

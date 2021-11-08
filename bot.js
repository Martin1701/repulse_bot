const fs = require("fs"); // fs module, to interact with file system
const Discord = require("discord.js"); // discord js module
const { prefix, token, creatorID } = require("./config.json"); // config json (with token and prefix)
const client = new Discord.Client(); // create new client instance
client.commands = new Discord.Collection();

const queue = new Map(); // music queue
// read commands directory (javascript files in it)
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

// read permissions from file (so it doesn't need to be loaded every time permission check is needed)
let data = fs.readFileSync("permissions.json");
try {
  var permissions = JSON.parse(data.toString());
} catch (err) {
  var permissions = {};
}
module.exports = {
  client: client,
  queue: queue,
  permissions: permissions,
};
for (const file of commandFiles) {
  const command = require(`./commands/${file}`); // load all command files
  client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  // this code will run when message will be sent
  if (!(message.content.startsWith(prefix) || message.channel.type === "dm") /* || message.author.bot*/) return;
  const args = message.content.replace(prefix, "").trim().split(/ +/);
  const commandName = args.shift().toLowerCase(); // convert command to loverCase
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName) // check if the command / alias exists
    );

  if (!command) return;

  if (command.args) {
    if (!args.length) {
      return message.channel.send(`You didn't provide any arguments!`);
    }
    if (args.length < command.args && typeof command.args == "number") {
      // changed from != to <
      return message.channel.send(`You provided ${args.length} ${args.length == 1 ? "argument" : "arguments"} (${command.args} needed!)`);
    }
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now(); // get current time
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000; // if command has no predefined cooldown, set 3 second default

  //* cooldown control logic (cooldown is separate for each user)
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  //* check permissions
  if (creatorID[0] != message.author.id) {
    if (command.requireCreator === true) {
      /*return message.reply(
        `This command can only be executed by <@!${creatorID[0]}>`
      );*/
    } else {
      let data = fs.readFileSync("permissions.json");
      try {
        var permissions = JSON.parse(data.toString());
      } catch (err) {
        var permissions = {};
      }

      if (permissions[command.name]) {
        if (permissions[command.name].includes(message.author.id)) {
        } else {
          return message.channel.send("you don't have permissions to execute this command !");
        }
      }
    }
  }
  if (!command.DM && message.channel.type === "dm") {
    // but cooldowns still work in DM disabled commands, to prevent spamming
    return message.channel.send(`I'm sorry, but this command doesn't work in DMs`);
  }
  try {
    command.execute(message, args);
  } catch (error) {
    //console.error(error);
    // client.users.get(creatorID[[0]]).send("error occurred");
    client.users
      .get(creatorID[[0]])
      .send(
        `**username: **${message.author.username}\n**channel: **${
          message.channel.type === "dm" ? "dm" : message.channel.name
        }\n**command: ** ${command.name}\n**arguments: **${args}\n${"```js\n" + error.stack + "```"}`
      );
    // client.users.get(creatorID[[0]]).send(console.error(error));
    message.channel.send("there was an error trying to execute that command!");
  }
});
// login to Discord with your token
client.login(token);

const fs = require("fs"); // fs module, to interact with file system
const Discord = require("discord.js"); // discord js module
const { prefix, token, creatorID } = require("./config.json"); // config json (with token and prefix)
const client = new Discord.Client(); // create new client instance
client.commands = new Discord.Collection();

const queue = new Map(); // music queue

// read commands directory (javascript files in it)
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// exports
module.exports = {
  client: client,
  queue: queue,
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
  if (!message.content.startsWith(prefix) || message.author.bot) return; // only proceed if message starts with predefined prefix and it was not sent from a bot

  const args = message.content.slice(prefix.length).trim().split(/ +/); // remove prefix from message
  const commandName = args.shift().toLowerCase(); // convert command to loverCase (all commands are loverCase but user can write upperCase)
  //
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName) // find if the command exists (or alias)
    );

  if (!command) return;

  //* i did this :-)
  // check for user inputted arguments and number of arguments that command requires
  // true = unlimited arguments (>= 1)
  // false = 0 arguments
  // number = just this number of arguments, no more, no less
  if (command.args) {
    // check if command requires arguments
    if (!args.length) {
      return message.channel.send(
        `You didn't provide any arguments, ${message.author}!`
      );
    }
    if (
      args.length < command.args ||
      (args.length > command.args && typeof command.args == "number")
    ) {
      return message.channel.send(
        `You provided ${args.length} ${
          args.length == 1 ? "argument" : "arguments"
        } (${command.args} needed), ${message.author}!`
      );
    }
  }

  //
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection()); // if command has set cooldown, set cooldown
  }

  const now = Date.now(); // get actual time
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000; // if command has no predefined cooldown, set 3 second default

  //* cooldown control logic (cooldown is separate for each user)
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  //* check permissions
  if (creatorID[0] != message.author.id) {
    if (command.requireCreator === true) {
      // if you are not the creator of this bot
      // this is the only wa it will work
      return message.reply(
        `This command can only be executed by <@!${creatorID[0]}>`
      );
    } else {
      let data = fs.readFileSync("permissions.json");
      try {
        var permissions = JSON.parse(data.toString());
      } catch (err) {
        var permissions = {};
      }

      if (permissions[command.name]) {
        // if property read it
        if (permissions[command.name].includes(message.author.id)) {
          // you have permissions, continue
        } else {
          return message.reply(
            "you don't have permissions to execute this command !"
          );
        }
      }
    }
  }
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error); // print errors to console
    // client.users.get(creatorID[[0]]).send("error occurred");
    client.users.get(creatorID[[0]]).send(error.toString());
    message.reply("there was an error trying to execute that command!");
  }
});
// login to Discord with your app's token
client.login(token);

module.exports = {
  name: "error",
  description: "just to test error handling",
  aliases: ["err"],
  args: 0,
  requirePermission: false,
  hidden: true,
  DM: true,
  execute(message, args) {
    const data = User.voiceChannel;
    return;
  },
};

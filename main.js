const Discord = require("discord.js");

const TOKEN = "OTU2ODYxMDM4MTAyNDcwNjU4.Yj2YSQ.L_rOW3g5feySOv5Y6tTDl5KhNiE";

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES"],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.content == "hi") {
    message.reply("Hello world!");
  }
});

client.login(TOKEN);

const Discord = require("discord.js");
const mongoose = require("mongoose");
const User = require("./User");

const TOKEN = "OTU2ODYxMDM4MTAyNDcwNjU4.Yj2YSQ.L_rOW3g5feySOv5Y6tTDl5KhNiE";

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES"],
});

mongoose.connect(
  "mongodb+srv://en:mciGODtvNITv2yZg@cluster0.sqg2x.mongodb.net/Discord?retryWrites=true&w=majority"
);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.content == "hi") {
    message.reply("Hello world!");
  }
});

client.login(TOKEN);

// en
// mciGODtvNITv2yZg

async function run() {
  const user = await User.create({
    name: "Kylge",
    age: 26,
    hobbies: ["Weight Lifting", "Bowling"],
    address: {
      steet
    }
  });
  user.name = "Sally";
  console.log(user);
}

run();

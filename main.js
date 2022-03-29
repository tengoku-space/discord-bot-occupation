const Discord = require("discord.js");

const TOKEN = "OTU2ODYxMDM4MTAyNDcwNjU4.Yj2YSQ.L_rOW3g5feySOv5Y6tTDl5KhNiE";

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
  ],
});

const ROLES = ["r1", "r2"];

const CHANNEL_ID = "958138084699033620";
let channel;

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  channel = await client.channels.fetch(CHANNEL_ID);
  const row = new Discord.MessageActionRow().addComponents(
    new Discord.MessageButton()
      .setCustomId("ban_yes")
      .setEmoji("🎈")
      .setLabel("Start Quiz")
      .setStyle("SUCCESS")
  );

  channel.send({
    content: "Choose your job.",
    components: [row],
    ephemeral: true,
  });

  const filter = (btn) => {
    console.log(btn);
    // return click.user.id === btn.user.id;
    return true;
  };

  const collector = channel.createMessageComponentCollector({
    filter,
    max: 1,
    time: 1000 * 15,
  });

  collector.on("collect", (i) => {
    i.reply({
      content: "Qustion 1",
      ephemeral: true,
    });
  });

  collector.on("end", (collection) => {
    collection.forEach((click) => {
      console.log(click.user.id, click.customId);
    });
  });
});

// New user joined
client.on("guildMemberAdd", (newUser) => {
  // check roles
  let role = newUser.guild.roles.filter((role) => !(role.name in ROLES));
  if (role.length === 0) {
    // new user
    channel.updateOverwrite(newUser, {
      permissions: [
        Discord.Permissions.FLAGS.VIEW_CHANNEL,
        Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY,
      ],
    });
  } else {
    // already had a role
    channel.updateOverwrite(newUser, {
      permissions: [],
    });
  }
});

client.on("messageCreate", (msg) => {
  // console.log(msg);
  const users = client.users.cache.filter((user) => user.username != undefined);
  // let welcomeRole = user.roles.find((role) => !(role.name in ROLES));
  // console.log(welcomeRole);
});

// client.on("messageCreate", (msg) => {
//   // console.log(msg);
//   if (msg.content == "hi") {
//     msg.reply({ content: "Hello woreeeld", ephemeral: true });
//   }
// });

client.login(TOKEN);

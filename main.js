const Discord = require("discord.js");
const Questions = require("./question");
require("dotenv").config();

//! Config
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

const MARK_ROLE = "Verified Sweetie";
const ROLES = [
  "Aviator", // 0
  "Confessor", // 1
  "Kunoichi", // 2
  "Guard of Tengoku", // 3
  "Treatment Squad", // 4
  "Bounty Ranger", // 5
];

const ROLES_EMBED = {};
ROLES_EMBED[ROLES[0]] = {
  imgUrl:
    "https://cdn.discordapp.com/attachments/960443366133342269/960494282899341342/Aviator.jpg",
  color: "#112057",
};
ROLES_EMBED[ROLES[1]] = {
  imgUrl:
    "https://cdn.discordapp.com/attachments/960443366133342269/960494283637526578/Confessor.jpg",
  color: "#e3a725",
};
ROLES_EMBED[ROLES[2]] = {
  imgUrl:
    "https://cdn.discordapp.com/attachments/960443366133342269/960494283822092328/Kunoichi.jpg",
  color: "#4d2980",
};
ROLES_EMBED[ROLES[3]] = {
  imgUrl:
    "https://cdn.discordapp.com/attachments/960443366133342269/960494283155202068/Guard_of_Tengoku.jpg",
  color: "#ae2513",
};
ROLES_EMBED[ROLES[4]] = {
  imgUrl:
    "https://cdn.discordapp.com/attachments/960443366133342269/960494283385872444/Treatment_Squad.jpg",
  color: "#0f819c",
};
ROLES_EMBED[ROLES[5]] = {
  imgUrl:
    "https://cdn.discordapp.com/attachments/960443366133342269/960494284052787240/Bounty_Ranger.jpg",
  color: "#272731",
};

//! Const
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
  ],
});

//! Local variable
let guild;
let channel;
const answers = {};

//! Event
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  channel = await client.channels.fetch(CHANNEL_ID);
  guild = await client.guilds.cache.find((u) => u.id === GUILD_ID);

  await channel.send("Cleaning messages...");
  await clearPreviewChannelMsg();
  await channel.send({
    embeds: Questions.quiz.embeds,
    components: Questions.quiz.components,
    ephemeral: false,
  });

  initActivity();
  initButtonCollector();
  initMenuCollector();
});

// // New user joined
// client.on("guildMemberAdd", async (newUser) => {
//   if (await checkRoleExist(newUser)) {
//     // already had a role
//   } else {
//     const newRole = await guild.roles.cache.find((r) => r.name === MARK_ROLE);
//     // new user
//     await newUser.roles.add(newRole);
//   }
// });

const clearPreviewChannelMsg = async () => {
  const msgs = await channel.messages.fetch({
    limit: 100,
  });
  await msgs
    .filter((msg) => msg.author.bot)
    .forEach(async (msg) => {
      await msg.delete();
    });
};

const initActivity = () => {
  client.user.setActivity("Elysium", {
    type: "STREAMING",
    url: "https://www.youtube.com/watch?v=jCzQZ2VeVAk",
  });
};

const initButtonCollector = () => {
  const filter = (interaction) => interaction.isButton();

  const collector = channel.createMessageComponentCollector({
    filter,
  });

  collector.on("collect", async (interaction) => {
    const uid = interaction.user.id;
    await interaction.deferUpdate();

    if (await checkRoleExist(interaction.user)) {
      // already had a role
      const roleNames = await getRoleNames(interaction.user);
      const roleName = roleNames[0];
      // Remove mark role
      await removRole(interaction, MARK_ROLE);
      // Show answer
      await replyTheAnswer(interaction, roleName);
    } else if (!answers[uid]) {
      answers[uid] = {};
      await nextQuestion(interaction);
    } else if (Object.keys(answers[uid]).length === 0) {
      await nextQuestion(interaction);
    } else {
      let id = "q1";
      while (id && answers[uid][id]) {
        id = Questions[id].nextId;
      }
      if (id) {
        await nextQuestion(interaction, id);
      } else {
        await checkAnswers(interaction);
      }
    }
  });
};

const initMenuCollector = () => {
  const filter = (interaction) => interaction.isSelectMenu();

  const collector = channel.createMessageComponentCollector({
    filter,
  });

  collector.on("collect", async (interaction) => {
    saveAnswer(interaction);
    await interaction.deferUpdate();
    await disableQuestion(interaction);
    if (await checkRoleExist(interaction.user)) {
      // already had a role
      const roleNames = await getRoleNames(interaction.user);
      const roleName = roleNames[0];
      // Remove mark role
      await removRole(interaction, MARK_ROLE);
      // Show answer
      await replyTheAnswer(interaction, roleName);
    } else if (Questions[interaction.customId].nextId) {
      await nextQuestion(interaction);
    } else {
      await checkAnswers(interaction);
    }
  });
};

const saveAnswer = (interaction) => {
  const uid = interaction.user.id;
  const id = interaction.customId;
  if (interaction.values && interaction.values.length > 0) {
    answers[uid][id] = interaction.values[0];
    // console.log(answers);
  }
};

const rowAnswer = new Discord.MessageActionRow().addComponents(
  new Discord.MessageSelectMenu()
    .setCustomId("q1")
    .setPlaceholder("Choose answer")
    .setDisabled(true)
    .addOptions([
      {
        label: "Any",
        value: "Any",
      },
    ])
);

const disableQuestion = async (interaction) => {
  rowAnswer.components[0].setPlaceholder(interaction.values[0]);
  await interaction.editReply({
    components: [rowAnswer],
  });
};

const nextQuestion = async (interaction, nextid) => {
  const id = interaction.customId;
  const nextId = nextid || Questions[id].nextId;
  if (nextId) {
    await interaction.followUp({
      embeds: Questions[nextId].embeds,
      components: Questions[nextId].components,
      ephemeral: true,
    });
  }
};

const checkRoleExist = async (user) => {
  if (user.roles) {
    // GuildMemeber
    const roles = await user.roles.cache.filter((r) => ROLES.includes(r.name));
    return roles.size > 0;
  }
  // User
  const member = await guild.members.cache.get(user.id);
  const roles = await member.roles.cache.filter((r) => ROLES.includes(r.name));
  return roles.size > 0;
};

const getRoleNames = async (user) => {
  const member = await guild.members.cache.get(user.id);
  return await member.roles.cache
    .filter((r) => ROLES.includes(r.name))
    .map((r) => r.name);
};

const checkAnswers = async (interaction) => {
  //! hardcoding here
  const qIds = ["q1", "q2", "q3", "q4", "q5", "q6"];
  const scores = [-1, 1, 0, 0, 1, 0]; // an emtpy array match rolss

  qIds.forEach((qid) => {
    const an = answers[interaction.user.id][qid];
    const sc = Questions[qid].scores[an];
    sc.forEach((idx) => scores[idx]++);
  });

  const max = Math.max(...scores);
  const indexes = [];
  for (let index = 0; index < scores.length; index++) {
    if (scores[index] === max) {
      indexes.push(index);
    }
  }

  let idx = indexes[Math.floor(Math.random() * indexes.length)] || 0;
  const roleName = ROLES[idx];
  // Add occupation role
  await addRole(interaction, roleName);
  // Remove mark role
  await removRole(interaction, MARK_ROLE);
  // Show answer
  await replyTheAnswer(interaction, roleName);
};

const addRole = async (interaction, roleName) => {
  const role = await interaction.member.guild.roles.cache.find(
    (r) => r.name === roleName
  );
  await interaction.member.roles.add(role);
};

const removRole = async (interaction, roleName) => {
  const markRole = interaction.member.guild.roles.cache.find(
    (r) => r.name === roleName
  );
  await interaction.member.roles.remove(markRole);
};

const replyTheAnswer = async (interaction, roleName) => {
  interaction.followUp({
    embeds: [
      new Discord.MessageEmbed()
        .setColor(ROLES_EMBED[roleName].color)
        .setTitle(`You're ${roleName}.`)
        .setImage(ROLES_EMBED[roleName].imgUrl)
        .setFooter({
          text: "TENGOKU",
          iconURL:
            "https://cdn.discordapp.com/attachments/532998959002550296/975025358527139930/Tengoku.jpg",
        })
        .setTimestamp(),
    ],
    // content: `You're ${roleName}.`,
    ephemeral: true,
  });
};

client.login(TOKEN);

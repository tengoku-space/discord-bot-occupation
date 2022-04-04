const Discord = require("discord.js");
const Questions = require("./question");
require("dotenv").config();

//! Config
const TOKEN = "OTU2ODYxMDM4MTAyNDcwNjU4.Yj2YSQ.L_rOW3g5feySOv5Y6tTDl5KhNiE";
const NEW_ROLE = "Verified Sweetie";
const ROLES = [
  "Aviator", // 0
  "Confessor", // 1
  "Kunoichi", // 2
  "Guard of Tengoku", // 3
  "Treatment Squad", // 4
  "Bounty Ranger", // 5
];
const CHANNEL_ID = process.env.CHANNEL_ID;
const GUILD_ID = process.env.GUILD_ID;

const ROLES_EMBED_IMG = {};
ROLES_EMBED_IMG[ROLES[0]] =
  "https://cdn.discordapp.com/attachments/960443366133342269/960494282899341342/Aviator.jpg";
ROLES_EMBED_IMG[ROLES[1]] =
  "https://cdn.discordapp.com/attachments/960443366133342269/960494283637526578/Confessor.jpg";
ROLES_EMBED_IMG[ROLES[2]] =
  "https://cdn.discordapp.com/attachments/960443366133342269/960494283822092328/Kunoichi.jpg";
ROLES_EMBED_IMG[ROLES[3]] =
  "https://cdn.discordapp.com/attachments/960443366133342269/960494283155202068/Guard_of_Tengoku.jpg";
ROLES_EMBED_IMG[ROLES[4]] =
  "https://cdn.discordapp.com/attachments/960443366133342269/960494283385872444/Treatment_Squad.jpg";
ROLES_EMBED_IMG[ROLES[5]] =
  "https://cdn.discordapp.com/attachments/960443366133342269/960494284052787240/Bounty_Ranger.jpg";

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
  channel.send({
    embeds: Questions.quiz.embeds,
    components: Questions.quiz.components,
    ephemeral: false,
  });

  initButtonCollector();
  initMenuCollector();
});

// New user joined
client.on("guildMemberAdd", async (newUser) => {
  if (await checkRoleExist(newUser)) {
    // already had a role
  } else {
    // const newRole = await guild.roles.cache.find((r) => r.name === NEW_ROLE);
    // // new user
    // await newUser.roles.add(newRole);
  }
});

const checkRoleExist = async (user) => {
  const roles = user.roles.cache.filter((r) => ROLES.includes(r.name));
  return roles.size > 0;
};

const initButtonCollector = () => {
  const filter = (interaction) => interaction.isButton();

  const collector = channel.createMessageComponentCollector({
    filter,
  });

  collector.on("collect", async (interaction) => {
    const uid = interaction.user.id;
    await interaction.deferUpdate();
    if (!answers[uid]) {
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
    if (Questions[interaction.customId].nextId) {
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

const checkAnswers = async (interaction) => {
  // console.log(interaction.user.id, answers[interaction.user.id]);
  // TODO: hardcoding here
  const qIds = ["q1", "q2", "q3", "q4", "q5", "q6"];
  const scores = [0, 0, 0, 0, 0, 0]; // an emtpy array match rolss

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
  // get role
  const roleName = ROLES[idx];
  const role = await interaction.member.guild.roles.cache.find(
    (r) => r.name === roleName
  );
  await interaction.member.roles.add(role);
  interaction.followUp({
    embeds: [
      new Discord.MessageEmbed()
        .setTitle(`You're ${roleName}.`)
        .setImage(ROLES_EMBED_IMG[roleName]),
    ],
    content: `You're ${roleName}.`,
    ephemeral: true,
  });

  const newRole = interaction.member.guild.roles.cache.find(
    (r) => r.name === NEW_ROLE
  );
  await interaction.member.roles.remove(newRole);
};

client.login(TOKEN);

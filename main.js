const Discord = require("discord.js");
const Questions = require("./question");

//! Config
const TOKEN = "OTU2ODYxMDM4MTAyNDcwNjU4.Yj2YSQ.L_rOW3g5feySOv5Y6tTDl5KhNiE";
const ROLES = [
  "Aviator", // 0
  "Guardian", // 1
  "Treatment Team", // 2
  "Bounty Hunter", // 3
  "Prayer", // 4
  "Shinobi Genshi", // 5
];
const CHANNEL_ID = "958138084699033620";

//! Const
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
  ],
});

//! Local variable
let channel;
const answers = {};

//! Event
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  channel = await client.channels.fetch(CHANNEL_ID);
  channel.send({
    content: Questions.quiz.content,
    components: Questions.quiz.components,
    ephemeral: true,
  });

  initButtonCollector();
  initMenuCollector();
});

// New user joined
client.on("guildMemberAdd", (newUser) => {
  if (checkRoleExist(newUser)) {
    // already had a role
    channel.updateOverwrite(newUser, {
      permissions: [],
    });
  } else {
    // new user
    channel.updateOverwrite(newUser, {
      permissions: [
        Discord.Permissions.FLAGS.VIEW_CHANNEL,
        Discord.Permissions.FLAGS.READ_MESSAGE_HISTORY,
      ],
    });
  }
});

const checkRoleExist = (user) => {
  let role = user.guild.roles.filter((role) => !(role.name in ROLES));
  return role.length > 0;
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
    console.log(answers);
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
  console.log(interaction.user.id, answers[interaction.user.id]);
  //TODO: check answers, get role
  const roleName = ROLES[0];
  const role = interaction.member.guild.roles.cache.find(
    (r) => r.name === roleName
  );
  await interaction.member.roles.add(role);
  interaction.followUp({ content: `You're ${roleName}.`, ephemeral: true });
};

client.login(TOKEN);

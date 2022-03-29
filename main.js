const Discord = require("discord.js");
const Questions = require("./question");

//! Config
const TOKEN = "OTU2ODYxMDM4MTAyNDcwNjU4.Yj2YSQ.L_rOW3g5feySOv5Y6tTDl5KhNiE";
const ROLES = ["r1", "r2"];
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

const initButtonCollector = () => {
  const filter = (interaction) => interaction.isButton();

  const collector = channel.createMessageComponentCollector({
    filter,
  });

  collector.on("collect", async (interaction) => {
    console.log("aaa");
    const uid = interaction.user.id;
    await interaction.deferUpdate();
    if (!answers[uid]) {
      answers[uid] = {};
      nextQuestion(interaction);
    }
  });
};

const initMenuCollector = () => {
  const filter = (interaction) => interaction.isSelectMenu();

  const collector = channel.createMessageComponentCollector({
    filter,
  });

  collector.on("collect", async (interaction) => {
    console.log("bbbb");
    await interaction.deferUpdate();
    saveAnswer(interaction);
    disableQuestion(interaction);
    if (Questions[interaction.customId].nextId) {
      nextQuestion(interaction);
    } else {
      checkAnswers(interaction);
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

const disableQuestion = (interaction) => {
  rowAnswer.components[0].setPlaceholder(interaction.values[0]);
  interaction.editReply({
    components: [rowAnswer],
  });
};

const nextQuestion = async (interaction) => {
  const id = interaction.customId;
  const nextId = Questions[id].nextId;
  const msg = interaction.message;
  channel.send({
    content: Questions[nextId].content,
    components: Questions[nextId].components,
    ephemeral: true,
  });
};

const checkAnswers = (interaction) => {
  console.log(answers[interaction.user.id]);
};

client.login(TOKEN);

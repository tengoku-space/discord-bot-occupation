const Discord = require("discord.js");
const Questions = {
  quiz: {
    start: true,
    nextId: "q1",
    content: "Choose your job",
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId("quiz")
          .setEmoji("🎈")
          .setLabel("Start Quiz")
          .setStyle("SUCCESS")
      ),
    ],
  },
  q1: {
    start: false,
    nextId: "q2",
    embeds: [
      new Discord.MessageEmbed()
        .setTitle("Q1: What do you want to eat?")
        .setDescription("<A> Apple.\n<B> Banana.\n<C> Orange.")
        .setImage("https://pbs.twimg.com/media/FNQUtZ0VIAA4N5s?format=jpg"),
    ],
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("q1")
          .setPlaceholder("Choose answer")
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions([
            {
              label: "A",
              value: "A",
            },
            {
              label: "B",
              value: "B",
            },
            {
              label: "C",
              value: "C",
            },
          ])
      ),
    ],
  },
  q2: {
    start: false,
    content: "Q2: What's your favorite color?\n",
    embeds: [
        new Discord.MessageEmbed()
          .setTitle("Q2: What's your favorite color?")
          .setDescription("<A> Red.\n<B> Green.\n<C> Blue.")
          .setImage("https://pbs.twimg.com/media/FNQUtZ0VIAA4N5s?format=jpg"),
      ],
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("q2")
          .setPlaceholder("Choose answer")
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions([
            {
              label: "A",
              value: "A",
            },
            {
              label: "B",
              value: "B",
            },
            {
              label: "C",
              value: "C",
            },
          ])
      ),
    ],
  },
};

module.exports = Questions;

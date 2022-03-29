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
    content: "Q1: What do you want to eat?\nA: Apple.\nB: Banana.\nC. Orange",
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
    content: "Q2: What's your favorite color?\nA: Red.\nB: Green.\nC. Blue",
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

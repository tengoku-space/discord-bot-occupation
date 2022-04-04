const Discord = require("discord.js");
const Questions = {
  quiz: {
    start: true,
    nextId: "q1",
    embeds: [
      new Discord.MessageEmbed()
        .setTitle("Sweetie Recruiter")
        .setDescription("Please take your time to finish our quiz.")
        .setImage(
          "https://cdn.discordapp.com/attachments/960443366133342269/960491286278856764/Logo_Matrix.JPG"
        )
        .setFooter({
          text: "Crypto Sweethearts",
          iconURL:
            "https://cdn.discordapp.com/attachments/960535813840588900/960544663285153802/Logo.png",
        }),
    ],
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId("quiz")
          .setEmoji("💥")
          .setLabel("Start Your Occupation")
          .setStyle("SUCCESS")
      ),
    ],
  },
  q1: {
    start: false,
    nextId: "q2",
    embeds: [
      new Discord.MessageEmbed()
        .setTitle("#1 Do you wanna get higher?")
        .setFooter({
          text: "Crypto Sweethearts",
          iconURL:
            "https://cdn.discordapp.com/attachments/960535813840588900/960544663285153802/Logo.png",
        })
        .setTimestamp(),
    ],
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("q1")
          .setPlaceholder("Yes or no")
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions([
            {
              label: "Yes",
              value: "Yes",
            },
            {
              label: "No",
              value: "No",
            },
          ])
      ),
    ],
    scores: {
      Yes: [0, 3, 5],
      No: [1, 2, 4],
    },
  },
  q2: {
    start: false,
    nextId: "q3",
    embeds: [
      new Discord.MessageEmbed()
        .setTitle(
          "#2 Would you sacrifice a loved one to save a dozen strangers?"
        )
        .setFooter({
          text: "Crypto Sweethearts",
          iconURL:
            "https://cdn.discordapp.com/attachments/960535813840588900/960544663285153802/Logo.png",
        })
        .setTimestamp(),
    ],
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("q2")
          .setPlaceholder("Yes or no")
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions([
            {
              label: "Yes",
              value: "Yes",
            },
            {
              label: "No",
              value: "No",
            },
          ])
      ),
    ],
    scores: {
      Yes: [0, 1, 4],
      No: [2, 3, 5],
    },
  },
  q3: {
    start: false,
    nextId: "q4",
    embeds: [
      new Discord.MessageEmbed()
        .setTitle("#3 Do you think you will have any regrets when you’re 90?")
        .setFooter({
          text: "Crypto Sweethearts",
          iconURL:
            "https://cdn.discordapp.com/attachments/960535813840588900/960544663285153802/Logo.png",
        })
        .setTimestamp(),
    ],
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("q3")
          .setPlaceholder("Yes or no")
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions([
            {
              label: "Yes",
              value: "Yes",
            },
            {
              label: "No",
              value: "No",
            },
          ])
      ),
    ],
    scores: {
      Yes: [1, 2, 4],
      No: [0, 3, 5],
    },
  },
  q4: {
    start: false,
    nextId: "q5",
    embeds: [
      new Discord.MessageEmbed()
        .setTitle("#4 Do you think justice really exists?")
        .setFooter({
          text: "Crypto Sweethearts",
          iconURL:
            "https://cdn.discordapp.com/attachments/960535813840588900/960544663285153802/Logo.png",
        })
        .setTimestamp(),
    ],
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("q4")
          .setPlaceholder("Yes or no")
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions([
            {
              label: "Yes",
              value: "Yes",
            },
            {
              label: "No",
              value: "No",
            },
          ])
      ),
    ],
    scores: {
      Yes: [0, 3, 4],
      No: [1, 2, 5],
    },
  },
  q5: {
    start: false,
    nextId: "q6",
    embeds: [
      new Discord.MessageEmbed()
        .setTitle(
          "#5 If a stranger offered to give your family 1 million dollars if you go to jail for 10 years, would you do it?"
        )
        .setFooter({
          text: "Crypto Sweethearts",
          iconURL:
            "https://cdn.discordapp.com/attachments/960535813840588900/960544663285153802/Logo.png",
        })
        .setTimestamp(),
    ],
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("q5")
          .setPlaceholder("Yes or no")
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions([
            {
              label: "Yes",
              value: "Yes",
            },
            {
              label: "No",
              value: "No",
            },
          ])
      ),
    ],
    scores: {
      Yes: [3, 4, 5],
      No: [0, 1, 2],
    },
  },
  q6: {
    start: false,
    embeds: [
      new Discord.MessageEmbed()
        .setTitle(
          "#6 When making a decision, you rely more on your feelings than on analysis of the situation."
        )
        .setFooter({
          text: "Crypto Sweethearts",
          iconURL:
            "https://cdn.discordapp.com/attachments/960535813840588900/960544663285153802/Logo.png",
        })
        .setTimestamp(),
    ],
    components: [
      new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("q6")
          .setPlaceholder("Yes or no")
          .setMaxValues(1)
          .setMinValues(1)
          .addOptions([
            {
              label: "Yes",
              value: "Yes",
            },
            {
              label: "No",
              value: "No",
            },
          ])
      ),
    ],
    scores: {
      Yes: [1, 2, 5],
      No: [0, 3, 4],
    },
  },
};

module.exports = Questions;

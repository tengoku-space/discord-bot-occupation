# discord-bot-occupation
Take quiz and choose occupation

## Development information
* platform: `node.js v16`
* `package.json`: 
  * `discord.js: v13.6`
  * `dotenv: v16`

## Run project
1. Initialize project, run `npm i`.
2. Create a config file named `.env`, content refered to `.env.sample`.
3. Run project in development mode, run `npm run dev-start`.
4. Run project in deployment mode, run `node main.js`.

## About `.env`

```bash
DISCORD_BOT_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXX.XXXXXX.XXXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXX
GUILD_ID=XXXXXXXXXXXXXXXXXX
CHANNEL_ID=XXXXXXXXXXXXXXXXXX
```
* `DISCORD_BOT_TOKEN`, discord bot token, find or create new on [discord developers](https://discord.com/developers/applications).
* `GUILD_ID` and `CHANNEL_ID`
  * Turn on **Developer Mode** in Discord -> Setting -> APP SETTINGS -> Advanced 
  * Right click the **guild** and **channel** in Tengoku Discord to show IDs.

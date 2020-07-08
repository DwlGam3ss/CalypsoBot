const config = require('./config.json');
const Client = require('./src/Client.js');
const { Intents } = require('discord.js');
global.__basedir = __dirname;

// Command types
global.types = {
  INFO: 'info',
  FUN: 'fun',
  COLOR: 'color',
  XP: 'xp',
  MISC: 'misc',
  MOD: 'mod',
  ADMIN: 'admin',
};

// Client setup
const intents = new Intents();
intents.add(
  'GUILD_PRESENCES',
  'GUILD_MEMBERS',
  'GUILDS',
  'GUILD_VOICE_STATES',
  'GUILD_MESSAGES',
  'GUILD_MESSAGE_REACTIONS'
);
const client = new Client(config, { ws: { intents: intents } });

// Initialize client
function init() {
  client.loadEvents('./src/events');
  client.loadCommands('./src/commands');
  client.loadTopics('./data/trivia');
  client.login(client.token);
}

init();
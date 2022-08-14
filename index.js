const {Client,Collection,Intents,MessageEmbed} = require('discord.js');
const {token,logID,guildID} = require('./config.json');
const fs = require('fs');
const client = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_VOICE_STATES,Intents.FLAGS.GUILD_MEMBERS]});

client.commands=new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
   const command = require(`./commands/${file}`);
   client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
   const event = require(`./events/${file}`);
   if (event.once) {
      client.once(event.name, (...args) => event.execute(...args,client));
   } else {
      client.on(event.name, (...args) => event.execute(...args,client));
   }
}

client.login(token);
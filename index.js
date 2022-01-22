const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const Sequelize = require('sequelize');
const dotenv = require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// db connection string
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

// table models
const WaifuResults = sequelize.define('waifuresults', {
  date: Sequelize.DATE,
  userName: Sequelize.STRING,
  score: Sequelize.INTEGER
});

const Players = sequelize.define('players', {
  playerData: Sequelize.JSON,
  playerId: {
    type: Sequelize.INTEGER,
    unique: true,
  },
});

client.commands = new Collection();
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// for (const file of commandFiles) {
// 	const command = require(`./commands/${file}`);
// 	client.commands.set(command.data.name, command);
// }

// for (const file of eventFiles) {
// 	const event = require(`./events/${file}`);
// 	if (event.once) {
// 		client.once(event.name, (...args) => event.execute(...args));
// 	} else {
// 		client.on(event.name, (...args) => event.execute(...args));
// 	}
// }

client.once('ready', () => {
  WaifuResults.sync();
  Players.sync();
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  
  if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	} else if (commandName === 'participate') {
    const player = interaction.options.getUser('user');
    // console.log(player);
    try {
      const participant = await Players.create({
        player: player,
        playerId: player.id,
      });
      return interaction.reply(`Player ${player} added!`);
    }
    catch (error) {
      console.log(error);
      return interaction.reply('Failed to add player.')
    }
    // await interaction.reply(`You want to add ${userName} to the war`)
  } else if (commandName === 'listplayers') {
    const playerList = await Players.findAll({attributes: ['playerId', 'playerData']});
    const playerListString = playerList.map(playerData => playerData.playerData)
    return interaction.reply(`All players \n ${[playerList]}`);
  }

	// const command = client.commands.get(interaction.commandName);

  // if (!command) return;

  // try {
	// 	await command.execute(interaction);
	// } catch (error) {
	// 	console.error(error);
	// 	await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	// }
});

client.login(process.env.DISCORD_TOKEN);
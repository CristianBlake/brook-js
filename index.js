require("dotenv").config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { Player, useQueue, useHistory } = require('discord-player');

const TOKEN = process.env.TOKEN;

const client = new Client({ intents: ['GuildVoiceStates', GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(TOKEN);


//? PLAYER -----------------------------------------------------------------------------------
const player = new Player(client);
player.extractors.loadDefault();

player.events.on('playerStart', (queue, track) => {

  //setting buttons
  const buttons = new ActionRowBuilder()
    .addComponents([
      new ButtonBuilder()
        .setEmoji('⏪')
        .setStyle('Secondary')
        .setCustomId('previosPlayer'),
      new ButtonBuilder()
        .setEmoji('⏹️')
        .setStyle('Secondary')
        .setCustomId('stopPlayer'),
      new ButtonBuilder()
        .setEmoji('⏸️')
        .setStyle('Secondary')
        .setCustomId('resumePlayer'),
      new ButtonBuilder()
        .setEmoji('⏩')
        .setStyle('Secondary')
        .setCustomId('nextPlayer')
    ]);


  const embedTemplate = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`${track.title} - ${track.author}`)
    .setURL(track.url)
    .setAuthor({ name: `Brook está interpretando`, iconURL: 'https://cdn.discordapp.com/app-icons/1110364188066451586/a37b6de114a0b7f575bbcb857d35fb44.png'})
    .setThumbnail(track.thumbnail)
    .setDescription(`💀 Disfruta la entonación ¡YOHOHO!`)
    .setFooter({ text: `Duración: ${track.duration}` });

  // we will later define queue.metadata object while creating the queue
  queue.metadata.channel.send({
    embeds: [ embedTemplate ],
    components: [ buttons ]
  });
});

//? Interactions ---------------------------------------------------------------------

client.on(Events.InteractionCreate, async interaction => {

  //?PLAYER BUTTONS INTERACTIONS

  const queue = useQueue(interaction.guild.id);
  const history = useHistory(interaction.guild.id);

  if ( interaction.customId == 'previosPlayer' ) {
    await history.previous();
    interaction.reply(`💀 Esta era la canción anterior ¡YOHOHO!`);
  }

  if ( interaction.customId == 'stopPlayer' ) {
    await queue.delete();
    interaction.reply(`💀 Borré la lista de música en cola ¡YOHOHO!`);
  }

  if ( interaction.customId == 'resumePlayer' ) {
    await queue.node.setPaused(!queue.node.isPaused());

    let isPaused = queue.node.isPaused() ? '💀 Pausé la música ¡YOHOHO!' : '💀 Que siga la música ¡YOHOHO!';

    interaction.reply(isPaused);
  }

  if ( interaction.customId == 'nextPlayer' ) {
    await queue.node.skip()
    interaction.reply(`💀 Siguiente canción ¡YOHOHO!`);
  }


	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
